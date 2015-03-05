var fs = require('fs')
var path = require('path')
var gulp = require('gulp')
var mocha = require('gulp-mocha')

// Tasks
// -----

// Run tests on the core library.
gulp.task('test (unit)', function () {
  process.env.NODE_ENV = 'testing'
  process.env.DEBUG = '*'
  return gulp.src('test/unit/**/test-*.js')
    .pipe(mocha({reporter: 'spec'}))
})

gulp.task('test (integration)', ['test (unit)'], function () {
  process.env.NODE_ENV = 'testing'
  return gulp.src('test/integration/**/test-*.js')
    .pipe(mocha({reporter: 'spec'}))
})

gulp.task('default', ['test (unit)', 'test (integration)'])
