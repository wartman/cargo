(function (factory) {

  if(typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd === 'object') {
    define(function () {
      return factory();
    });
  } else {
    window.Base = factory();
  }

}(function () {
  
  // Base
  // ----
  // OOP stuff for javascript
  // Based on Dean Edward's Base.js (http://dean.edwards.name/weblog/2006/03/base/)
  var Base = function () {
    // dummy
  };

  // Create a new class.
  Base.extend = function (props, staticProps) {
    var extend = Base.prototype.extend;

    // Ensure the constructor is not called while we're
    // prototyping (see constructor func).
    Base._prototyping = true;
    var proto = new this();
    extend.call(proto, props);
    proto.sup = function () {
      // Acess to the current function's parent.
    };
    delete Base._prototyping;

    // Create a wrapper for the constructor function.
    var constructor = proto.constructor;
    var subClass = proto.constructor = function () {
      if (!Base._prototyping) {
        if (this._constructing || this.constructor === subClass) {
          // Instantiation
          this._constructing = true;
          constructor.apply(this, arguments);
          delete this._constructing;
        } else if (arguments[0] !== null) {
          // Casting
          return (arguments[0].extend || extend).call(arguments[0], proto);
        }
      }
    };

    // Build the class interface.
    subClass.parent = this;
    subClass.extend = this.extend;
    subClass.addProperty = this.addProperty;
    subClass.mixin = this.mixin;
    subClass.prototype = proto;
    subClass.toString = this.toString;
    subClass.valueOf = function (type) {
      return (type === 'object') ? subClass : constructor.valueOf();
    };

    // Add static properties.
    extend.call(subClass, staticProps);
    // If there is a static init, call it (class initialization)
    if (typeof subClass.init === 'function') subClass.init();
    return subClass;
  };

  // Extend an instance.
  Base.prototype.extend = function (source) {
    var addProperty = Base.prototype.addProperty;
    if (arguments.length > 1) {
      // extending a property (key/val pair)
      addProperty.apply(this, arguments);
    } else if (source) {
      var extend = Base.prototype.extend;
      var key;
      // If this object has a customized extend method, use it.
      if (!Base._prototyping && typeof this !== 'function') {
        extend = this.extend || extend;
      }
      var proto = {
        toSource: null
      };
      // Do 'toString' and other methods manually.
      var hidden = ['constructor', 'toString', 'valueOf'];
      // Iterate over `hidden` methods. If we are prototyping, 
      // ensure we have a constructor.
      var i = Base._prototyping? 0 : 1;
      while (key = hidden[i++]) {
        if (source[key] != proto[key])
          addProperty.call(this, key, source[key]);
      }
      for (key in source) {
        if (!proto[key])
          addProperty.call(this, key, source[key]); 
      }
    }
    return this;
  };

  // Add a property or method to an instance. If 'value' is a function
  // and it includes a 'this.sup' call, this method will bind
  // 'sup' to the parent property.
  Base.prototype.addProperty = function (key, value) {
    var parent = this[key];
    var testSuper = /\bsup\b/g;

    // Override the method if it needs a 'sup' call.
    if (parent && (typeof value === 'function')
        // 'valueOf' compairison to avoid circular refs
        && (!parent.valueOf || parent.valueOf() !== value.valueOf())
        && testSuper.test(value)) {
      // Get underlying method
      var method = value.valueOf();
      // Override, binding the sup method to the parent method.
      value = function () {
        var previous = this.sup || Base.prototype.sup;
        this.sup = parent;
        var result = method.apply(this, arguments);
        this.sup = previous;
        return result;
      };
      // Point to the underlying method.
      value.valueOf = function (type) {
        return (type === 'object')? value : method;
      };
      value.toString = Base.toString;
    }
    this[key] = value;
  };

  // Initialize
  Base = Base.extend({

    // Default constructor
    constructor: function () {
      this.extend(arguments[0]);
    }

  }, {

    parent: Object,
    version: '0.0.1',

    // Allows multiple inheritance.
    mixin: function () {
      for(var i = 0; i < arguments.length; i += 1) {
        if ('function' === typeof arguments[i]) {
          // If it's a function, call it, passing this prototype.
          arguments[i](this.prototype);
        } else {
          // Extend this proto
          this.prototype.extend(arguments[i]);
        }
      }
      return this;
    },

    // Add properties to the prototype.
    addProperty: function () {
      this.prototype.addProperty.apply(this.prototype, arguments);
    },

    // toString implementation
    toString: function () {
      return String(this.valueOf());
    }

  });

  return Base;

}));