var Migrations = require('../db/migrations');
var models = require('../models');
var con = require('../db/connect').getConnection();

// Helper to check if the database is ready.
// If this catches an error, you should redirect the
// user to an installer page to setup their site.
var dbReady = function () {
  var migrate = new Migrations(models, con);
  return migrate.init();
};

// Check that the database is initialized, and redirect
// to the installer if not. If no user with an 'Owner' role is
// provided, the user will be directed to create one.
module.exports = function (rabbit, next) {
  var app = rabbit.getApp();
  dbReady().then(function () {
    // Check to see if an owner is registered.
    var admin = models.User.findOne({'role': 'Owner'}).then(function (user) {
      next();
    }).catch(function () {
      app.use(function (req, res, next) {
        // @todo
        // Should render a setup view.
        res.send('No user found');
        // res.redirect('/rabbit/setup');
      });
      next();
    });
  }).catch(function (err) {
    console.log(err);
    app.use(function (req, res, next) {
      // @todo
      // Should render a setup view.
      res.send('Install needed');
      // res.redirect('/rabbit/setup');
    });
    next();
  });
};
