(function (factory) {

  if(typeof module !== 'undefined' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd === 'object') {
    define(factory);
  } else {
    window.Base = factory();
  }

}(function () {

  // Helpers
  // -------

  // Wrap a method for super calls.
  var wrap = function (method, parentMethod) {
    if (!parentMethod || 'function' !== typeof method)
      return method;

    var testSuper = /\bsup\b/g;
    if ((!parentMethod.valueOf 
         // Check for circular references
         || parentMethod.valueOf() !== method.valueOf())
        && testSuper.test(method.toString())) {
      // Ensure we're using the underlying function (if this has
      // been wrapped before)
      var originalMethod = method.valueOf();
      method = function () {
        var ret = this.sup || Base.prototype.sup;
        this.sup = parentMethod;
        var result = originalMethod.apply(this, arguments);
        this.sup = ret;
        return result;
      };
      // Make valueOf and toString return the unwrapped functions,
      // which is a lot more useful for debugging / etc.
      method.valueOf = function () {
        return originalMethod;
      };
      method.toString = Base.toString;
    }

    return method;
  };

  // Mixin an object.
  var mixin = function (obj, src, options) {
    options = options || {};
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        if (options.noWrap) {
          obj[key] = src[key];
        } else {
          var supProp = obj[key];
          obj[key] = wrap(src[key], supProp);
        }
      }
    }
  };

  // Base
  // ----
  // A simple OOP system that allows for super calls and other fun stuff.
  var Base = function () {
    // Dummy
  };

  // Extend the base object and create a new class.
  Base.extend = function (props, staticProps) {
    props = props || {};
    staticProps = staticProps || {};

    Base.__prototyping = true;

    // Inherit prototype from the parent.
    var parent = this;
    var proto = new parent();

    // Mixin prototype props.
    mixin(proto, props);

    // Create the constructor
    var constructor = proto.constructor;
    var SubClass = proto.constructor = function () {
      if (!Base.__prototyping) {
        var result = constructor.apply(this, arguments);
        if (result) return result;
      }
    };

    delete Base.__prototyping;

    // Inherit static props from the parent (without wrapping functions).
    mixin(SubClass, parent, {noWrap: true});

    // Make .valueOf return the actual content of the 
    // constructor, not our wrapped value.
    SubClass.valueOf = function () {
      return constructor.valueOf();
    };

    // Set the parent reference
    SubClass.ancestor = parent;

    // Add in static props
    mixin(SubClass, staticProps);

    // Add proto props.
    SubClass.prototype = proto;

    return SubClass;
  };

  // Mixin to the object prototype.
  Base.mixin = function () {
    for (var i = 0; i <= arguments.length; i += 1) {
      mixin(this.prototype, arguments[i]);
    }
    return this;
  };

  // Mixin static methods.
  Base.mixinStatic = function () {
    for (var i = 0; i <= arguments.length; i += 1) {
      mixin(this, arguments[i]);
    }
    return this;
  };

  Base.valueOf = function (){
    return '[Base]';
  };

  Base.toString = function () {
    return String(this.valueOf());
  };

  // Ensure the correct constructor is set.
  Base.prototype.constructor = Base;

  // Set a property, wrapping it with a super call if
  // needed.
  Base.prototype.set = function (key, value) {
    var parentProp = this[key];
    this[key] = wrap(value, parentProp);
    return this;
  };

  // Get a property or method.
  Base.prototype.get = function (key) {
    return this[key];
  };

  return Base;

}));