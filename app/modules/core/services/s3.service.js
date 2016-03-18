'use strict';
const Promise = require('bluebird');
// const s3 = require('s3');
// const knox = require('knox');
const AWS = require('aws-sdk');
const fs = Promise.promisifyAll(require('fs'));


module.exports = function s3Service(Config, Util) {

  AWS.config.update({
    accessKeyId: Config.s3.key,
    secretAccessKey: Config.s3.secret,
    region: Config.s3.region,
  });

  let s3bucket = Promise.promisifyAll(new AWS.S3());



  /**
   * Uploads file
   * @param {object} file:
   * {
      filename: '1(4).jpg',
      path: '/var/folders/3r/blpfsx_d2llg6rpm_733t26h0000gn/T/1457945747370-1941-50753d67554bbd2c',
      headers: {
        'content-disposition': 'form-data; name="file"; filename="1(4).jpg"',
        'content-type': 'image/jpeg'
      },
      bytes: 50058
    }
   * @return {Promise} promise
   */
  function upload(file) {

    let key = Util.getUUID();
    let body = Buffer.isBuffer(file) ? file : fs.createReadStream(file.path);

    return s3bucket.uploadAsync({
      Key: key,
      ACL: 'public-read',
      Bucket: Config.s3.bucket,
      ContentType: file.headers['content-type'],
      Body: body,
    })
      .then(function(){
        return key;
      });

  }


  function uploadBuffer(buffer, options) {

    let key = options.key;

    return s3bucket.uploadAsync({
      Key: key,
      ACL: 'public-read',
      Bucket: options.Bucket,
      ContentType: options.ContentType,
      Body: buffer,
    })
      .then(function(){
        return key;
      });

  }


  return {
    upload: upload,
    uploadBuffer: uploadBuffer,
  };


};


module.exports['@singleton'] = true;
module.exports['@require'] = [
  'config/config',
  'core.services/util',
];


