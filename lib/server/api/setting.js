var API = require('./base');
var models = require('../models');

// SettingAPI
// ----------
var SettingAPI = API.extend({

  ModelClass: models.Setting

});

module.exports = SettingAPI;
