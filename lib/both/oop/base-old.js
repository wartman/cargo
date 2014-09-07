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
    props = props || {};
    staticProps = staticProps || {};

    // Ensure the constructor is not called while we're
    // prototyping (see constructor func).
    Base._prototyping = true;
    var proto = new this();
    extend.call(proto, props);
    proto.sup = function () {
      // Access to the current function's parent. This will be replaced
      // with a pointer to a parent method in each of this class's methods.
      // If called outside an instance, it will throw an error.
      throw new Error('Cannot call sup outside an instance.');
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

    subClass.parent = this;

    // Add static properties.
    for (var key in this) {
      // Make sure statics are inherited from the parent
      if (this.hasOwnProperty(key) 
          && !staticProps.hasOwnProperty(key)
          && key !== 'parent')
        staticProps[key] = this[key];
    }
    extend.call(subClass, staticProps);

    // Assign the prototype.
    subClass.prototype = proto;
    
    // Set valueOf manually.
    subClass.valueOf = function (type) {
      return (type === 'object') ? subClass : constructor.valueOf();
    };

    // If there is a static init, call it (class initialization)
    if (typeof subClass.init === 'function') subClass.init();
    return subClass;
  };

  // Add a property or method to an instance. If 'value' is a function
  // and it includes a 'this.sup' call, this method will bind
  // 'sup' to the parent property.
  Base.prototype.set = function (key, value) {
    var parent = this[key];
    var testSuper = /\bsup\b/g;

    // Override the method if it needs a 'sup' call.
    if (parent && (typeof value === 'function')
        // 'valueOf' compairison to avoid circular refs
        && (!parent.valueOf || parent.valueOf() !== value.valueOf())
        && testSuper.test(value.toString())) {
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
    return this;
  };

  // Get a property or method from this instance.
  Base.prototype.get = function (key) {
    return this[key];
  };

  // Extend an instance.
  Base.prototype.extend = function (source) {
    var set = Base.prototype.set;
    if (arguments.length > 1) {
      // extending a property (key/val pair)
      set.apply(this, arguments);
    } else if (source) {
      var extend = Base.prototype.extend;
      var key;
      if ('function' === typeof source) {
        var proxy = {};
        source.call(proxy);
        source = proxy;
      }
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
          set.call(this, key, source[key]);
      }
      for (key in source) {
        if (!proto[key])
          set.call(this, key, source[key]); 
      }
    }
    return this;
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
        this.prototype.extend(arguments[i]);
      }
      return this;
    },

    // Add static mixins
    mixinStatic: function () {
      for(var i = 0; i < arguments.length; i+= 1) {
        // Extend statics
        var obj = arguments[i];
        if ('object' !== typeof obj){
          throw new Error('Argument must be an object or function: ' + typeof obj);
        }
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            this[key] = obj[key];
          }
        }
      }
      return this;
    },

    // Add properties to the prototype.
    set: function () {
      this.prototype.set.apply(this.prototype, arguments);
    },

    // toString implementation
    toString: function () {
      return String(this.valueOf());
    }

  });

  return Base;

}));