'use strict';
const Path = require('path');

module.exports = function(ctrl) {

  let routes = [{
    path: '/signup',
    method: 'POST',
    handler: ctrl.signup
  }, {
    path: '/signin',
    method: 'POST',
    config: {
      handler: ctrl.signin,
      auth: {
        mode: 'try',
        strategy: 'session'
      }
    }
  }, {
    path: '/signout',
    method: 'GET',
    handler: ctrl.signout,
  }];

  return function(options){
    let prefix = options && options.prefix || '/auth';
    routes.forEach(function(route) {
      route.path = Path.join(prefix, route.path);
    });
    return routes;
  };

};

module.exports['@singleton'] = true;
module.exports['@require'] = [
  'auth.controllers/auth.ctrl',
];


// let routes = [{
//   path: '/forgot',
//   method: 'POST',
//   // handler: ctrl.forgot
// }, {
//   path: '/reset/{token}',
//   method: 'GET',
//   // handler: ctrl.validateResetToken
// }, {
//   path: '/reset/{token}',
//   method: 'POST',
//   // handler: ctrl.reset
// }, {
//   path: '/signup',
//   method: 'POST',
//   // handler: ctrl.signup
// }, {
//   path: '/signin',
//   method: 'POST',
//   config: {
//     handler: ctrl.signin,
//     auth: {
//       mode: 'try',
//       strategy: 'session'
//     }
//   }
// }, {
//   path: '/signout',
//   method: 'GET',
//   handler: ctrl.signout,
// }, {
//   path: '/facebook',
//   method: ['GET', 'POST'],
//   config: {
//     auth: 'facebook',
//     pre: [{
//       // method: require('../../config/strategies/facebook').preFacebook,
//       assign: 'user'
//     }],
//     // handler: ctrl.oauthCallback
//   }
// }, {
//   path: '/twitter',
//   method: ['GET', 'POST'],
//   config: {
//     auth: 'twitter',
//     pre: [{
//       // method: require('../../config/strategies/twitter').preTwitter,
//       assign: 'user'
//     }],
//     // handler: ctrl.oauthCallback
//   }
// }, {
//   path: '/google',
//   method: ['GET', 'POST'],
//   config: {
//     auth: 'google',
//     pre: [{
//       // method: require('../../config/strategies/google').preGoogle,
//       assign: 'user'
//     }],
//     // handler: ctrl.oauthCallback
//   }
// }, {
//   path: '/github',
//   method: ['GET', 'POST'],
//   config: {
//     auth: 'github',
//     pre: [{
//       // method: require('../../config/strategies/github').preGithub,
//       assign: 'user'
//     }],
//     // handler: ctrl.oauthCallback
//   }
// }, {
//   path: '/linkedin',
//   method: ['GET', 'POST'],
//   config: {
//     auth: 'linkedin',
//     pre: [{
//       // method: require('../../config/strategies/linkedin').preLinkedin,
//       assign: 'user'
//     }],
//     // handler: ctrl.oauthCallback
//   }
// }];
