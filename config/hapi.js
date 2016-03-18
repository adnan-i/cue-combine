'use strict';

/**
 * Module dependencies.
 */
const ioc = require('electrolyte');
const Fs = require('fs');
const Https = require('https');
const Hapi = require('hapi');
const Catbox = require('catbox');
const Path = require('path');
const Promise = require('bluebird');

// const Logger = require('./logger');
// const Config = require('./config');
// const Boom = require('boom');
const Config = ioc.create('config/config');
const Logger = ioc.create('config/logger');

module.exports = function() {

  return function(){

    let serverOptions = {
      cache: {
        engine: new Catbox.Client(require('catbox-redis'), {
          host: Config.db.redis.host,
          port: Config.db.redis.port,
          database: Config.db.redis.database,
          password: Config.db.redis.password
        })
      },
      connections: {
        router: {
          stripTrailingSlash: true
        }
      },
      debug: {
        request: ['error']
      }
    };

    // Initialize hapi app
    let server = new Hapi.Server(serverOptions);

    // Setup https server if NODE_ENV is secure
    if (process.env.NODE_ENV === 'secure') {
      // Load SSL key and certificate
      let privateKey = Fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
      let certificate = Fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

      // Create HTTPS Server
      let httpsServer = Https.createServer({
        key: privateKey,
        cert: certificate,
        passphrase: Config.passphrase
      });

      server.connection({
        listener: httpsServer,
        tls: true,
        autoListen: true,
        port: Config.port
      });
    } else {
      server.connection({
        port: Config.port
      });
    }


    // Setup global variables
    server.app.sessionName = Config.sessionName;

    let plugins = [{
      register: require('bell')
    }, {
      register: require('inert')
    }, {
      register: require('vision')
    }, {
      register: require('blipp')
    }, {
      register: require('hapi-auth-cookie')
    }, {
      register: require('hapi-boom-decorators')
    }, {
      register: require('hapi-sass'),
      options: {
        src: './public/sass',
        dest: './public/css',
        force: true,
        debug: true,
        routePath: '/css/{file}.css',
        // includePaths: ['./example/vendor/sass'],
        outputStyle: 'nested',
        sourceComments: true
      }
    }];

    // {
    //   register: require('hapi-sequelize'),
    //   options: {
    //     host: Config.db.pg.host,
    //     database: Config.db.pg.database,
    //     user: Config.db.pg.user,
    //     pass: Config.db.pg.password,
    //     dialect: 'postgres',
    //     port: Config.db.pg.port,
    //     models: ['./app/modules/*/models/**/*.js', './app/modules/*/models/*.js'],
    //   }
    // }

    let modules = [{
      register: require('../app/modules/core')
    }, {
      register: require('../app/modules/profile')
    }, {
      register: require('../app/modules/rentals')
    }, {
      register: require('../app/modules/auth')
    }];

    if (Config.log.enabled) {
      plugins.push({
        register: require('good'),
        options: {
          reporters: Logger.getLogReporters()
        }
      });
    }

    ioc.create('config/db');

    let register = Promise.promisify(server.register, {context: server});

    register(plugins)
      .then(function(){

        // Setting the app router and static folder
        server.route({
          method: 'GET',
          path: '/{path*}',
          config: {
            auth: false,
            handler: {
              directory: {
                path: Path.resolve('./public'),
                listing: false,
                index: true
              }
            }
          }
        });

        // Setup Cache
        let authCache = server.cache({
          segment: server.app.sessionName,
          expiresIn: 1000 * 60 * 60 * 24
        });
        server.app.authCache = authCache;

        // Setup the authentication strategies
        server.auth.strategy('session', 'cookie', {
          cookie: server.app.sessionName,
          ttl: 1000 * 60 * 60 * 24,
          path: '/',
          isSecure: process.env.NODE_ENV === 'secure',
          password: Config.sessionSecret,

          validateFunc: function(request, session, callback) {

            server.app.authCache.get(session.id, function(_err, cached) {

              if (_err) {
                return callback(_err, false);
              }

              if (!cached) {
                return callback(null, false);
              }

              if (session.id !== request.state[server.app.sessionName].id) {
                return callback(null, false);
              }

              return callback(null, true, cached);
            });
          }
        });


        require('./strategies')(server);

        server.ext('onPreHandler', function(request, reply) {
          let util = ioc.create('core.services/util');
          util.req = request;
          reply.continue();
        });

        server.on('internalError', function (request, err) {
          console.log(err);
          //console.log('Error response (500) sent for request: ' + request.id + ' because: ' + (err.trace || err.stack || err));
        });

      })
      .then(function(){
        return register(modules);

      })
      .then(function(){

        server.emit('pluginsLoaded');

        // let t = server.table();
        // t.forEach(function(e){
        //   console.log(e);
        // });

      })
      .catch(function(err){
        console.error(err);
      });

    //   // Globbing routing files
    //   // Config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    //   //   require(Path.resolve(routePath))(server);
    //   // });


    // Return Hapi server instance
    return server;

  };

};

module.exports['@singleton'] = true;
