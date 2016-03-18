'use strict';
var ioc = require('electrolyte');

ioc.use('core', ioc.node('app/modules/core'));
ioc.use('core.services', ioc.node('app/modules/core/services'));
ioc.use('core.controllers', ioc.node('app/modules/core/controllers'));
ioc.use('core.routes', ioc.node('app/modules/core/routes'));
ioc.use('core.models', ioc.node('app/modules/core/models'));

const Config = ioc.create('config/config');

module.exports.register = function(server, options, next) {

  server.views({
    engines: {
      jade: require('jade')
    },
    relativeTo: __dirname,
    path: 'views',

    isCached: process.env.NODE_ENV !== 'development',
    context: {
      title: Config.app.title,
      description: Config.app.description,
      keywords: Config.app.keywords,
      facebookAppId: Config.facebook.clientID,
      jsFiles: Config.getJavaScriptAssets(),
      cssFiles: Config.getCSSAssets()
    }

  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: {
        view: 'index'
      },
      auth: {
        mode: 'try',
        strategy: 'session'
      }
    }
  });


  // Hande 404 errors
  server.ext('onPreResponse', function(request, reply) {

    // console.log('error', request.response.stack);

    if (request.response.isBoom && request.response.output.statusCode === 404) {
      if (request.headers.accept !== 'application/json') {
        return reply.view('404', {
          url: request.url.path
        });
      }
    }

    return reply.continue();

  });

  server.on('request-internal', (req, event, tags) => {
    if (!tags.error || !event.data || !event.data.data) {
      return;
    }
    const dta = event.data.data;
    if (dta.output) {
      req.log(event.tags, 'ERROR: HTTP ' + dta.output.statusCode + ': ' + ((dta.output.payload && dta.output.payload.message) || ''));
    }
    req.log(event.tags, dta.stack);

  });

  next();

};

module.exports.register.attributes = {
  name: 'core',
  version: '0.0.0'
};

module.exports['@singleton'] = false;
