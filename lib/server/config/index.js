var configRaw = require('../../../config');
var oop = require('../core/base');

// Config
// ------
// Get values from the config.
var Config = oop.Base.extend({

  // Set the config cache.
  constructor: function () {
    var env = configRaw.env;
    this.cache = configRaw[env] || {};
  },

  // Change the current environment.
  setEnv: function (env) {
    if (configRaw[env]) {
      this.cache = configRaw[env];
    }
  },

  set: function (key, val) {
    if ('object' === typeof key) {
      for (var item in key) {
        this.set(item, key[item]);
      }
      return;
    }
    this.cache[key] = val;
  },

  get: function (key, def) {
    def = ('undefined' === typeof def)? false : def;
    return this.cache[key] || def;
  }

}, {

  get: function (key, def) {
    var cfg = this.getInstance();
    return cfg.get(key, def);
  },

  set: function (key, value) {
    var cfg = this.getInstance();
    return cfg.set(key, value);
  }

});

Config.mixinStatic(oop.mixins.singleton);

module.exports = Config;
