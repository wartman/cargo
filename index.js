var path = require('path')
var Cargo = require('./lib/cargo')

process.env.CARGO_MODULE_ROOT || (process.env.CARGO_MODULE_ROOT = (function(_rootPath) {
  var parts = _rootPath.split(path.sep)
  parts.pop() //get rid of /node_modules from the end of the path
  var modulePath = parts.join(path.sep)
  return modulePath
})(module.parent ? module.parent.paths[0] : module.paths[0]))

module.exports = Cargo
