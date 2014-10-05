var API = require('./base');
var models = require('../models');
var LocalStorage = require('../storage').LocalStorage;

// ProjectAPI
// ----------
var ProjectAPI = API.extend({

  ModelClass: models.Project,

});

module.exports = ProjectAPI;