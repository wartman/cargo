var API = require('./base');
var models = require('../models');

// ProjectAPI
// ----------
var ProjectAPI = API.extend({

  ModelClass: models.Project

});

module.exports = ProjectAPI;