var gulp = require('gulp');
var mocha = require('gulp-mocha');
var rabbitDb = require('./lib/server/db');
var config = require('./config');

gulp.task('test', function () {
  return gulp
    .src('test/**/test_*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

// Initialize Rabbit.
gulp.task('init', function () {
  // Create the database.
  var db = rabbitDb.getInstance();
  db.create();
})

gulp.task('default', ['test']);