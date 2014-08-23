(function (factory) {

  if(typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd === 'object') {
    define(function () {
      return factory();
    });
  } else {
    window.mixins = factory();
  }

}(function () {

  var mixins = {};

  mixins.singleton = {

    // Create or get a singleton of this class.
    getInstance: function () {
      if (this._instance)
        return this._instance;
      this.setInstance.apply(this, arguments);
      return this._instance;
    },

    // Set the current instance. Will apply all passed arguments
    // to the constructor.
    setInstance: function () {
      var constructor = this;
      var args = arguments;
      var Surrogate = function() {
        return constructor.apply(this, args);
      }
      Surrogate.prototype = constructor.prototype;
      this._instance = new Surrogate();
    }

  };

  return mixins;

}));