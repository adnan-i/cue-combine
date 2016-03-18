'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));

module.exports = function rentalsService(db, util, S3, Resizer, Config){

  let Rental = db.models.Rental;
  let RentalImage = db.models.RentalImage;

  function findAll(){
    return Rental.findAll({
      where: {
        ownerId: util.req.auth.credentials.id
      }
    });

  }


  function findOne(whereOptions){
    return Rental.findOne(whereOptions);

  }


  function create(rental) {
    rental.ownerId = util.req.auth.credentials.id;
    return Rental.create(rental);

  }


  function update(rawRental) {

    return findOne({
      id: rawRental.id
    })
      .then(function(rental){
        return rental.update(rawRental);
      });

  }


  function addImage(file, rentalId){
    let key;

    let dimensions = [{
      width: 100,
      height: 60
    }, {
      width: 200,
      height: 120
    }, {
      width: 400,
      height: 240
    }, {
      width: 800,
      height: 480
    }, {
      width: 1600,
      height: 960
    }];

    return S3.upload(file)
      .then(function(_key){
        key = _key;

        return Promise.map(dimensions, function(dim){
          return Resizer.resize(file.path, dim)
            .then(function(buffer){
              return {
                dimensions: dim,
                buffer: buffer
              };
            });
        });

      })
      .then(function(images){

        return Promise.map(images, function(image){

          let sizeKey = key + '_' + image.dimensions.width;

          return S3.uploadBuffer(image.buffer, {
            key: sizeKey,
            Bucket: Config.s3.bucketSizes,
            ContentType: 'image/png',
          })
            .then(function(){
              image.key = sizeKey;
              image.bucket = Config.s3.bucketSizes;
              return image;

            });

        });

      })
      .then(function(images){
        console.log(images);

        let sizes = _.map(images, function(image){
          delete image.buffer;
          return image;
        });

        return RentalImage.create({
          key: key,
          rentalId: rentalId,
          meta: file,
          sizes: sizes
        });

      })
      .finally(function(){
        return fs.unlink(file.path);
      });

  }


  return {
    findAll: findAll,
    findOne: findOne,
    create: create,
    update: update,
    addImage: addImage,
  };

};


module.exports['@singleton'] = true;
module.exports['@require'] = [
  'config/db',
  'core.services/util',
  'core.services/s3.service',
  'core.services/resizer.service',
  'config/config',
];
