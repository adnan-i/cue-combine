/*eslint-disable */
'use strict';

/**
 * Module dependencies.
 */
var Boom = require('boom');
var ErrorHandler = require('../errors.server.controller');
var Uuid = require('node-uuid');

/**
 * Create a new session.
 */
var login = exports.login = function(request, reply, user, callback) {

  var id = Uuid.v4();
  request.server.app.authCache.set(id, user, 1000 * 60 * 60 * 24,
    function(err) {
      if (err) {
        return reply(Boom.badRequest(err));
      }
      return false;

    }
  );

  request.cookieAuth.set({
    id: id
  });

  return callback;

};

/**
 * Signup
 */
exports.signup = function(request, reply) {

  // var User = request.collections.user;
  var User = request.models.User;
  // For security measurement we remove the roles from the request.body object
  delete request.payload.roles;

  // Init Variables
  var userData = request.payload;

  // Add missing user fields
  // user.provider = 'local';
  // user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  User.create(userData)
    .then(function(user) {

      user = user.toJSON();
      return login(request, reply, user, reply(user));

    })
    .catch(function(err){
      console.log(err);
      return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });

};


/**
 * Local Signin
 */
exports.signin = function(request, reply) {

  var User = request.models.User;

  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }

  var email = request.payload.email;
  var password = request.payload.password;
  if (!email || !password) {
    return reply(Boom.unauthorized('Email and password should not be blank'));
  }

  return User.findOne({
    email: email
  })
    .then(function(user) {
      if (!user) {
        return reply.unauthorized('Unknown email');
      }
      if (!user.isValidPassword(password)) {
        return reply.unauthorized('Invalid password');
      }

      user = user.toJSON();
      return login(request, reply, user, reply(user));

    })
    .catch(reply.badRequest.bind(reply));

};

/**
 * Signout
 */
exports.signout = function(request, reply) {

  request.cookieAuth.clear();
  reply.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/#!/signin');
  }
  return login(request, reply, request.pre.user, reply.redirect('/'));
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(request, providerUserProfile, done) {

  var User = request.collections.user;

  // check if user already logged in
  request.server.auth.test('session', request, function(err, credentials) {

    if (request.auth.isAuthenticated && !credentials) {

      // Define a search query to find existing user with current provider profile
      var query = 'SELECT * FROM "user" WHERE (' +
        '"provider" = \'' + providerUserProfile.provider + '\'' +
        ' AND ' +
        '"providerData"->>\'' + providerUserProfile.providerIdentifierField + '\' = \'' +
        providerUserProfile.providerData[providerUserProfile.providerIdentifierField] +
        '\')' +
        ' OR' +
        '("additionalProvidersData"#>>\'{' + providerUserProfile.provider + ',' +
        providerUserProfile.providerIdentifierField + '}\' = \'' +
        providerUserProfile.providerData[providerUserProfile.providerIdentifierField] +
        '\')' +
        ' LIMIT 1;';

      return User.query(query, function(err, results) {

        if (err) {
          return done(err);
        } else {
          if (!results.rows[0]) {
            var possibleUsername = providerUserProfile.username ?
              providerUserProfile.username :
              (providerUserProfile.email) ?
              providerUserProfile.email.split('@')[0] :
              '';

            User.findUniqueUsername(possibleUsername, null,
              function(availableUsername) {

                var user = {
                  firstName: providerUserProfile.firstName,
                  lastName: providerUserProfile.lastName,
                  username: availableUsername,
                  displayName: providerUserProfile.displayName,
                  email: providerUserProfile.email,
                  provider: providerUserProfile.provider,
                  providerData: providerUserProfile.providerData
                };

                // And save the user
                User.create(user, function(err, user) {
                  user = user.toJSON();
                  return done(err, user);
                });
              }
            );
          } else {

            var user = results.rows[0];

            // Clean user because
            // toJSON() is not available when doing manual queries in Waterline
            delete user.password;
            delete user.salt;
            delete user.resetPasswordExpires;
            delete user.resetPasswordToken;
            if (user.additionalProvidersData) {
              for (var provider in user.additionalProvidersData) {
                delete user.additionalProvidersData[provider].accessToken;
              }
            }
            if (user.providerData)
              delete user.providerData.accessToken;
            return done(err, user);
          }
        }
      });
    } else {
      // User is already logged in, join the provider data to the existing user
      var AuthUser = credentials;
      return User.findOne({
        id: AuthUser.id
      }, function(err, user) {

        // Check if user exists, is not signed in using this provider,
        // and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider &&
          (!user.additionalProvidersData ||
            !user.additionalProvidersData[providerUserProfile.provider])) {
          // Add the provider data to the additional provider data field
          if (!user.additionalProvidersData) {
            AuthUser.additionalProvidersData = {};
          }
          AuthUser.additionalProvidersData[providerUserProfile.provider] =
            providerUserProfile.providerData;

          // And save the user
          User.update({
            id: user.id
          }, AuthUser, function(err, users) {

            user = users[0].toJSON();
            return done(err, user, '/#!/settings/accounts');
          });
        } else {
          user = user.toJSON();
          return done(user);
        }
      });

    }
  });

};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(request, reply) {

  var User = request.collections.user;

  var user = request.auth.credentials;
  var provider = request.query.provider;

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];
    }

    User.update({
        id: user.id
      }, user)
      .exec(function(err, users) {

        if (err) {
          return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        } else {
          user = users[0].toJSON();

          return login(request, reply, user, reply(user));
        }
      });
  } else {
    return reply(Boom.badRequest('Invalid provider'));
  }
};
