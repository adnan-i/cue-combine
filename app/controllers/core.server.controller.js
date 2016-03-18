'use strict';
// const blue = require('bluebird');
// const fs = blue.promisifyAll(require('fs'));
// const path = require('path');
// const imagesPath = path.join(__dirname, '../../public/images/rentals');
// const _ = require('lodash');

// exports.index = function (request, reply) {

//   let user = request.auth.isAuthenticated ?
//     request.auth.credentials :
//     null;

//   return fs.readdirAsync(imagesPath)
//     .then(function(images){

//       images = _.chunk(images, 10);

//       reply.view('index', {
//         user: user,
//         request: request,
//         images: images
//       });

//     });

// };

exports.index = function(request, reply) {

  let user = request.auth.isAuthenticated ?
    request.auth.credentials :
    null;

  reply.view('index', {
    user: user,
    request: request,
  });

};
