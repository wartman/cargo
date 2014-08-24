// Middleware
// ----------
// Access to all of Rabbit's middleware.
exports.bodyParser = require('body-parser');
exports.serverError = require('./serverError')
exports.allowCrossDomain = require('./allowCrossDomain');