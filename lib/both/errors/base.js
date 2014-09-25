(function (factory) {

  if(typeof module !== 'undefined' && typeof module.exports === 'object') {
    factory(require, exports, module);
  } else if (typeof define !== 'undefined' && typeof define.amd === 'object') {
    define(factory);
  } else {
    throw new Error('requires an AMD compliant loader!')
  }

}(function (require, exports, module) {

  var Base = require('../oop/base');

  // CustomError
  // -----------
  // An extendable error that allows for customized
  // error handling. Like the name may suggest.
  var CustomError = Base.extend({

    constructor: function (message) {
      this.message = message
    },

    name: 'CustomError'

  });

  CustomError.mixin(Error.prototype);

  module.exports = CustomError;

}));