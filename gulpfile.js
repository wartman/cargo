var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var stylus = require('gulp-stylus');
var clean = require('gulp-clean');
var nib = require('nib');
var ModusBuild = require('modus/lib/build');
var merge = require('merge-stream');
var config = require('./config');

// Helpers
// -------

// Get folders in the specified dir.
function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      // Make sure the file is a directory
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};

// Tasks
// -----

// Run tests on the core library.
gulp.task('test', function () {
  process.env.NODE_ENV = 'testing';
  return gulp.src([
      'lib/both/test/**/test_*.js', 
      'lib/server/test/**/test_*.js'
    ], {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

// Build styles for each theme
gulp.task('build-styles', function () {
  var folders = getFolders('content/theme');
  var tasks = folders.map(function (folder) {
    var folderPath = path.join('content/theme', folder);
    return gulp.src(path.join(folderPath, 'assets/css/stylus/main.styl'))
      .pipe(stylus({
        use: nib(),
        compress: false
      }))
      .pipe(gulp.dest(path.join(folderPath, 'assets/css/build')))
  });
  return merge(tasks);
});

// Build the client library
gulp.task('build-client', function () {
  var build = ModusBuild.getInstance();
  build.start({
    root: __dirname + '/',
    main: 'lib/client/main',
    dest: 'content/theme/admin/assets/js/build/admin.js',
    minify: false
  }, function (content) {
    build.writeOutput(function () {
      console.log('Client compiled');
    });
  });
});


gulp.task('default', ['test']);
gulp.task('build', ['build-styles', 'build-client']);