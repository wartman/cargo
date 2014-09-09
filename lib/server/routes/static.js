var express = require('express');

// Static Routes
// -------------
// For serving static files.
var routes = function () {
  var router = express.Router(); 
  // Favicon
  // requires serve-favicon
  // router.use(favicon('/both/favicon.ico'));

  // Static assets
  // @todo: this is just copied from ghost for reference. Replace with your own stuff.
  // router.use('/shared', express['static'](path.join(corePath, '/shared'), {maxAge: utils.ONE_HOUR_MS}));
  // router.use('/content/images', storage.get_storage().serve());
  // router.use('/scripts', express['static'](path.join(corePath, '/built/scripts'), {maxAge: utils.ONE_YEAR_MS}));
  // router.use('/public', express['static'](path.join(corePath, '/built/public'), {maxAge: utils.ONE_YEAR_MS}));

  // Just some temp things
  router.use('/scripts', express['static']('lib/client')); // should point to 'built/scripts'.
  router.use('/admin/scripts', express['static']('lib/client'));

  return router;
};

module.exports = routes;