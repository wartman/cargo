var configRaw = require('../../../config')
var Config = require('../../both/util/config')

var ServerConfig = Config.extend({

  constructor: function () {
    var env = process.env.NODE_ENV || configRaw.env
    this.cache = {}
    this.setEnv(env)
  },

  // Change the current environment.
  setEnv: function (env) {
    this.cache = (configRaw[env])
       ? configRaw[env]
       : configRaw.production
  }

})

module.exports = ServerConfig
