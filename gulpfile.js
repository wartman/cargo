var gulp = require('gulp');
var mocha = require('gulp-mocha');
var models = require('./lib/server/models');
var config = require('./config');

gulp.task('test', function () {
  return gulp
    .src([
      'lib/both/test/**/test_*.js', 
      'lib/server/test/**/test_*.js'
    ], {read: false}).pipe(mocha({reporter: 'spec'}));
});

// Initialize Rabbit.
gulp.task('init', function () {
  // Create the database.
  models.install();
})

gulp.task('default', ['test']);