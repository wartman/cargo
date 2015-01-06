var Field = require('../field')

// Text fields
// -----------
var Txt = Field.extend({

  type: function () {
    return 'text'
  },

  // Outputs the field to an html-editable form.
  toHTML: function (name, options) {
    options || (options = {})
    var input = '<label for="' + name + '">' + options.label + '</label>'
    input += '<textarea name="' + name + '">' + options.value + '</textarea>'
    return input
  },

})

module.exports = Txt
