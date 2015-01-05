function InternalServerError(message) {
  this.message = message
  this.stack = new Error().stack
  this.code = 500
  this.type = this.name
}

InternalServerError.prototype = Object.create(Error.prototype)
InternalServerError.prototype.name = 'InternalServerError'

module.exports = InternalServerError
