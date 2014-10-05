var bodyParser = require('body-parser');
var isAdmin = require('./isAdmin');
var allowCrossDomain = require('./allowCrossDomain');
var setup = require('./setup');

// Export to register middleware.
module.exports = function (rabbit, next) {
  var app = rabbit.getApp();
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);
  
  // Handle admin and other middleware.
  app.use(isAdmin);
  app.use(setup);

  next();
};