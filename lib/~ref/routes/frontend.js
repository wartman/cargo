var frontend = require('../controllers/frontend');
var express = require('express');

// Frontend Routes
// ---------------
var routes = function () {
  var router = express.Router();

  router.get('/', frontend.index);
  router.get('/test/:id', frontend.testModel);
  router.get('/browse', frontend.browse);

  return router;
};

module.exports = routes;