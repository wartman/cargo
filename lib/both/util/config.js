(function (factory) {

  if(typeof module !== 'undefined' && typeof module.exports === 'object') {
    factory(require, exports, module);
  } else if (typeof define !== 'undefined' && typeof define.amd === 'object') {
    define(factory);
  }

}(function (require, exports, module) {

var Base = require('../oop/base');
var mixins = require('../oop/mixins/index')

// Config
// ------
// Get values from the config.
var Config = Base.extend({

  // Set the config cache.
  constructor: function (cache) {
    this.cache = cache || {};
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

Config.mixinStatic(mixins.singleton);

module.exports = Config;

}));