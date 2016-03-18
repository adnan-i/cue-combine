'use strict';
require('./config/init.js')();
var Config = require('./config/config.js');
var _ = require('lodash');

var conf = {
  client: 'postgresql',
  connection: Config.db.pg,
  pool: {
    min: 2,
    max: Config.db.pg.poolSize
  },
  migrations: {
    tableName: 'migrations'
  }
};

module.exports = {
  development: _.clone(conf),
  staging: _.clone(conf),
  production: _.clone(conf),
};
