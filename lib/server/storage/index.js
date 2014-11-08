var LocalStorage = require('./localStorage');

// Middleware for file storage
// For now, just supports local-file storage.
module.exports = function (rabbit, app) {
  var store = LocalStorage.getInstance();
  // Register localStorage as middleware.
  app.use(store.serve(rabbit.get('storage url')));
};
module.exports.LocalStorage = LocalStorage;
