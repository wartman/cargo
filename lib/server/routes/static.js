var express = require('express');

// Static Routes
// -------------
// For serving static files.
var developmentRoutes = function () {
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
  // should point to 'built/scripts' eventually? At least when in production mode:
  router.use('/scripts', express['static']('lib'));
  router.use('/admin/scripts', express['static']('lib'));
  router.use('/node', express['static']('node_modules'));
  router.use('/admin/node', express['static']('node_modules'));
  router.use('/content', express['static']('content'));
  router.use('/admin/content', express['static']('content'));

  return router;
};

module.exports.development = developmentRoutes;
// change this to the right thing later.
// Production routes should be limited to the 'built/scripts' folder in the 'content' dir.
module.exports.production = developmentRoutes;