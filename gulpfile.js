var fs = require('fs')
var path = require('path')
var gulp = require('gulp')
var mocha = require('gulp-mocha')
var stylus = require('gulp-stylus')
var clean = require('gulp-clean')
var nib = require('nib')
var merge = require('merge-stream')

// Helpers
// -------

// Get folders in the specified dir.
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      // Make sure the file is a directory
      return fs.statSync(path.join(dir, file)).isDirectory()
    })
}

// Tasks
// -----

// Run tests on the core library.
gulp.task('test (unit)', function () {
  process.env.NODE_ENV = 'testing'
  return gulp.src('test/unit/**/test-*.js')
    .pipe(mocha({reporter: 'spec'}))
})

gulp.task('test (integration)', ['test (unit)'], function () {
  process.env.NODE_ENV = 'testing'
  return gulp.src('test/integration/**/test-*.js')
    .pipe(mocha({reporter: 'spec'}))
})

// Build styles for each theme
// gulp.task('build-styles', function () {
//   var folders = getFolders('content/theme')
//   var tasks = folders.map(function (folder) {
//     var folderPath = path.join('content/theme', folder)
//     return gulp.src(path.join(folderPath, 'assets/css/stylus/main.styl'))
//       .pipe(stylus({
//         use: nib(),
//         compress: false
//       }))
//       .pipe(gulp.dest(path.join(folderPath, 'assets/css/build')))
//   })
//   return merge(tasks)
// })

gulp.task('default', ['test (unit)', 'test (integration)'])
// gulp.task('build', ['build-styles'])
