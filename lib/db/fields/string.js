var Field = require('../field')

// String fields
// -------------
var Str = Field.extend({

  type: function () {
    return 'string'
  }

})

module.exports = Str
