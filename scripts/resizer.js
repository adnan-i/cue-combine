'use strict';

const Gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');
let path = '../public/images/thumbs/';

function processImg(filesrc) {
  return Gulp.src(filesrc)
    // compress and save
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    // .pipe(Gulp.dest('../public/images/og'))
    // save 300 x 200
    .pipe(imageResize({
      width: 300,
      height: 200,
      format: 'png',
    }))
    .pipe(Gulp.dest(path + '320'))
    // save 120 x 120
    .pipe(imageResize({
      width: 120,
      height: 120,
      format: 'png',
    }))
    .pipe(Gulp.dest(path + '120'))
    // save 48 x 48
    .pipe(imageResize({
      width: 48,
      height: 48,
      format: 'png',
    }))
    .pipe(Gulp.dest(path + '48'));
}

process.on('message', function(image) {
  console.log('Image processing started...');

  let stream = processImg(image);

  stream.on('end', function() {
    process.send('Image processing complete');
    process.exit();
  });

  stream.on('error', function(err) {
    process.send(err);
    process.exit(1);
  });

});
