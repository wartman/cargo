// Allow cross-domain access 
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
};

module.exports = allowCrossDomain
 