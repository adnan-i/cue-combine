/*eslint-disable valid-jsdoc */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var Config = require('./config');

/**
 * Module init function.
 */
module.exports = function(server) {

  // Initialize strategies
  Config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {

    strategy = require(path.resolve(strategy));
    server.auth.strategy(strategy.strategyName, strategy.schemeName, strategy.strategyConfig);
  });
};
