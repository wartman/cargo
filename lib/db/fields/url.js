var Field = require('../field')
var validator = require('../../util').validator

// Url fields
// ----------
var Url = Field.extend({

  type: function () {
    return 'string'
  },

  validators: function () {
    return [validator.isURL]
  }

})

module.exports = Url
