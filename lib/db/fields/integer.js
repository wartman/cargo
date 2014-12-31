var Field = require('../field')
var validator = require('../../util').validator

// Integer fields
// --------------
var Int = Field.extend({

  type: function () {
    return 'integer'
  },

  validators: function () {
    return validator.isNumeric
  }

})

module.exports = Int
