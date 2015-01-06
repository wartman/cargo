var Field = require('../field')

// Password fields
// ---------------
var Password = Field.extend({

  type: function () {
    return 'string'
  },

  // Outputs the field to an html-editable form.
  toHTML: function (name, options) {
    options || (options = {})
    var input = '<label for="' + name + '">' + options.label + '</label>'
    input += '<input type="password" name="' + name + '" value="' + options.value + '">'
    return input
  },

})

module.exports = Password
