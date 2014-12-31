var Field = require('../field')

// Slug fields
// -----------
var Slug = Field.extend({

  type: function () {
    return 'string'
  },

  attributes: function () {
    return {
      nullable: false,
      unique: true
    }
  },

  parse: function (input) {
    return input.replace(/\s/g, '_').toLowerCase()
  }

})

module.exports = Slug
