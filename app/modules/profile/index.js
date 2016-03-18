'use strict';
var ioc = require('electrolyte');
const sprintf = require('sprintf-js').sprintf;
const name = 'profile';

module.exports.register = function (server, options, next) {
  options = options || {};

  ioc.use(sprintf('%s.services', name), ioc.node(sprintf('app/modules/%s/services', name)));
  ioc.use(sprintf('%s.controllers', name), ioc.node(sprintf('app/modules/%s/controllers', name)));
  ioc.use(sprintf('%s.routes', name), ioc.node(sprintf('app/modules/%s/routes', name)));

  server.route(ioc.create(name + '.routes/rentals.routes')(options));
  // server.route(require('./routes/rentals.routes')(server, options));
  // server.auth.default('session');

  next();

};

module.exports.register.attributes = {
  name: name,
  version: '0.0.0'
};
