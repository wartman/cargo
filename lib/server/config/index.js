var configRaw = require('../../../config');
var Config = require('../../both/util/config');

var ServerConfig = Config.extend({

  constructor: function () {
    var env = configRaw.env;
    this.cache = {};
    this.setEnv(env);
  },

  // Change the current environment.
  setEnv: function (env) {
    if (configRaw[env]) {
      this.cache = configRaw[env];
    }
  }

});

module.exports = ServerConfig;
