function NotImplementedError(message) {
  this.message = message || 'Method is not implemented'
  this.stack = new Error().stack
  this.code = 500
  this.type = this.name
}

NotImplementedError.prototype = Object.create(Error.prototype)
NotImplementedError.prototype.name = 'NotImplementedError'

module.exports = NotImplementedError
