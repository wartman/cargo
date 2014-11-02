var _ = require('underscore')
var Promise = require('bluebird')
var jajom = require('jajom')

var defaults = require('./defaults')
var models = require('../../models')
var errors = require('../../errors')

// Helper shortcut to log progress.
var logInfo = function (message) {
  errors.Logger.logInfo('Migrations', message)
}

var Fixtures = Base.extend({

  constructor: function (data) {
    this.data = data || defaults
  },

  populate: function () {
    // @todo
    // Should save defaults to each model.
  }

})