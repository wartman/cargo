var LocalStorage = require('./localStorage');

// Middleware for file storage
// For now, just supports local-file storage.
module.exports = function (rabbit, next) {
  var store = LocalStorage.getInstance();
  var app = rabbit.getApp();
  // Register localStorage as middleware.
  app.use(store.serve());
  next();
};
module.exports.LocalStorage = LocalStorage;
