var API = require('./base');
var models = require('../models');

// CatgeoryAPI
// ----------
var CatgeoryAPI = API.extend({

  ModelClass: models.Category

});

module.exports = CatgeoryAPI;