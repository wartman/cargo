var bodyParser = require('body-parser');

var Handler = require('../core/handler');
var allowCrossDomain = require('./allowCrossDomain');


// Middleware
// ----------
// Access to all of Rabbit's middleware.
var MiddlewareHandler = Handler.extend({

  middlewares: function () {
    // parse application/x-www-form-urlencoded
    var urlencoded = bodyParser.urlencoded({extended: false});
    // parse application/json
    var json = bodyParser.json();
    return [
      urlencoded,
      json,
      allowCrossDomain
    ];
  }

});

module.exports = MiddlewareHandler;