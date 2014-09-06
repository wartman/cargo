var _ = require('lodash');

var API = require('./base');
var models = require('../models');

// ProjectAPI
// ----------
var ProjectAPI = API.extend({

  ModelClass: models.Project,

  defaultOptions: function () {
    var opts = this.sup();
    var schema = this.ModelClass.getSchema();
    opts.allowedAttrs = _.keys(schema);
    return opts;
  }

});

module.exports.Project = ProjectAPI;