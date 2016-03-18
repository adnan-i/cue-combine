'use strict';
const Uuid = require('node-uuid');

module.exports = function utilService(){

  function getUUID() {
    return Uuid.v4();
  }


  return {
    getUUID: getUUID,
  };

};


module.exports['@singleton'] = true;
