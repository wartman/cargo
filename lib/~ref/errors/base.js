var jajom = require('jajom')

// CustomError
// -----------
// An extendable error that allows for customized
// error handling. Like the name may suggest.
var CustomError = jajom(Error).extend({

  constructor: function () {
    var tmp = Error.apply(this, arguments)
    tmp.name = this.name

    this.stack = tmp.stack
    this.message = tmp.message

    return this
  },

  name: 'CustomError'

})

module.exports = CustomError