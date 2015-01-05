var Field = require('../field')
var validator = require('../../util').validator

// Email fields
// ------------
var Email = Field.extend({

  type: function () {
    return 'string'
  },

  validators: function () {
    return validator.isEmail
  }

})

module.exports = Email
