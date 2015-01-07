var Field = require('../field')

// Password fields
// ---------------
var Password = Field.extend({

  type: function () {
    return 'string'
  },

})

module.exports = Password
