var Migrations = require('../db/migrations');
var models = require('../models');
var Logger = require('../util/logger');
var con = require('../db/connect').getConnection();

// Helper to check if the database is ready.
// If this catches an error, you should redirect the
// user to an installer page to setup their site.
module.exports = function (rabbit, next) {
  var migrate = new Migrations(models, con);
  migrate.init()
    .then(next)
    .catch(function (err) {
      Logger.logError(err);
      console.log(err);
      app.use(function (req, res, next) {
        // Ideally you should never see this. This
        // will only appear if something has gone completely
        // wrong with database initialization.
        res.status(500).send('Could not connect to database.');
        next();
      });
    });
};
