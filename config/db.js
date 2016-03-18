'use strict';
const Sequelize = require('sequelize');
const Glob = require('glob');
const Path = require('path');
const cwd = process.cwd();

module.exports = function(Config){
  let options = {
    host: Config.db.pg.host,
    database: Config.db.pg.database,
    user: Config.db.pg.user,
    pass: Config.db.pg.password,
    dialect: 'postgres',
    port: Config.db.pg.port,
  };

  let sequelize = new Sequelize(options.database, options.user, options.pass, options);

  let patterns = [
    './app/modules/*/models/**/*.js',
    './app/modules/*/models/*.js'
  ];

  var files = patterns.reduce(function(arr, pattern) {
    return arr.concat(Glob.sync(pattern, {
      nodir: true
    }));
  }, []);

  // import models found by glob
  var models = files.reduce(function(_models, file) {
    var filepath = Path.isAbsolute(file) ? file : Path.join(cwd, file);
    try {
      var model = sequelize.import(filepath);
      _models[model.name] = model;
    } catch (e) {
      console.warn(filepath + ' is not a valid model');
    }
    return _models;

  }, {});

  // create associations
  Object.keys(models).forEach(function(modelName) {
    if ('associate' in models[modelName]) {
      models[modelName].associate(models);
    }
  });

  return sequelize;

};

module.exports['@singleton'] = true;
module.exports['@require'] = [
  'config/config',
];
