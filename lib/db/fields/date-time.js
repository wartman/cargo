var Field = require('../field')

// DateTime fields
// ---------------
var DateTime = Field.extend({

  type: function () {
    return 'dateTime'
  }

})

module.exports = DateTime
