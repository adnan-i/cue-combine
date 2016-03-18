'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

module.exports = function rentalsService(db) {

  let Rental = db.models.Rental;

  function findAll() {
    // return Rental.findAll();

    const imagesPath = path.join(__dirname, '../../../../public/images/rentals');

    return fs.readdirAsync(imagesPath)
      .then(function(images) {
        return _.chain(images).shuffle().chunk(3).value();
      });

  }


  function findOne(whereOptions) {
    return Rental.findOne(whereOptions);

  }


  return {
    findAll: findAll,
    findOne: findOne,
  };

};


module.exports['@singleton'] = true;
module.exports['@require'] = [
  'config/db',
];
