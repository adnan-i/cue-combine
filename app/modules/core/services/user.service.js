'use strict';
var Boom = require('boom');

module.exports = function userService(db){

  let User = db.models.User;

  function findAll(){
    return User.findAll();

  }


  function findOne(whereOptions){
    return User.findOne(whereOptions)
      .then(function(user){
        if (!user){
          throw Boom.badRequest('Unknown user');
        }

        return user;

      });

  }


  function create(rawUser) {
    return User.create(rawUser);

  }


  function update(rawUser) {

    return findOne({
      id: rawUser.id
    })
      .then(function(user){
        return user.update(rawUser);
      });

  }


  return {
    findAll: findAll,
    findOne: findOne,
    create: create,
    update: update,
  };

};


module.exports['@singleton'] = true;
module.exports['@require'] = [
  'config/db',
];
