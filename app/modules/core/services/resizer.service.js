'use strict';
var sharp = require('sharp');

module.exports = function(){

  function resize(path, options){
    return sharp(path)
      .resize(options.width, options.height)
      .max()
      .normalize()
      .toFormat('png')
      .toBuffer()
      .then(function(outputBuffer) {
        return outputBuffer;
        // outputBuffer contains JPEG image data no wider than 200 pixels and no higher
        // than 200 pixels regardless of the inputBuffer image dimensions
      });

  }


  return {
    resize: resize,
  };

};

module.exports['@singleton'] = true;
