'use strict';
var ioc = require('electrolyte');

exports.register = function (server, options, next) {
  options = options || {};

  ioc.use('auth.controllers', ioc.node('app/modules/auth/controllers'));
  ioc.use('auth.routes', ioc.node('app/modules/auth/routes'));

  server.route(ioc.create('auth.routes/auth.routes')(options));

  next();

};

exports.register.attributes = {
  name: 'auth',
  version: '0.0.0'
};
