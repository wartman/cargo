var Field = require('../field')

// Text fields
// -----------
var Txt = Field.extend({

  type: function () {
    return 'text'
  }

})

module.exports = Txt
