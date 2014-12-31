var CustomError = require('./base')

// InternalServerError
// ------------------
// Thrown if something goes north with the server code.
var InternalServerError = CustomError.extend({

  constructor: function (message) {
  	this.sup(message)
    this.code = 500
    this.type = this.name
  },

  name: 'InternalServerError'

})

module.exports = InternalServerError