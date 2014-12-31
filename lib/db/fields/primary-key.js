var Field = require('../field')

// PrimaryKey fields
// -----------------
var PrimaryKey = Field.extend({

  type: function () {
    return 'increments'
  },

  attributes: function () {
    return {
      nullable: false,
      primary: true
    }
  },

  validators: function () {
    // Not 100% sure how to handle this guy.
    return []
  }

})

module.exports = PrimaryKey
