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

  // Helpers
  // -------

  // Wrap a method for super calls.
  var wrap = function (method, parentMethod, context) {
    if (!parentMethod || 'function' !== typeof method)
      return method;

    var testSuper = /\bsup\b/g;
    if (testSuper.test(method.toString())) {
      var originalMethod = method;
      method = function () {
        var ret = context.sup || Base.prototype.sup;
        context.sup = parentMethod;
        var result = originalMethod.apply(context, arguments);
        context.sup = ret;
        return result;
      }
    }

    return method;
  };

  // Base
  // ----
  // A simple OOP system that allows for super calls and other fun stuff.
  var Base = function () {
    return Base.extend(arguments[0]);
  };

  // Extend the base object and create a new class.
  Base.extend = function (props, staticProps) {
    props = props || {};
    staticProps = staticProps || {};

    var set = Base.prototype.set;
    var parent = this;

    if (!props.hasOwnProperty('constructor')) {
      props.constructor = function () {
        parent.apply(this, arguments);
      };
    }

    // Create the new class.
    var SubClass = props.constructor;

    // Inherit prototype from the parent.
    var Surrogate = function () { this.constructor = SubClass };
    Surrogate.prototype = parent.prototype;
    SubClass.prototype = new Surrogate();

    // Inherit static props from the parent.
    for (var key in parent) {
      if (parent.hasOwnProperty(key))
        SubClass[key] = parent[key];
    };

    // Set the parent reference
    SubClass.parent = parent;

    // Add in static props
    for (var key in staticProps) {
      if (staticProps.hasOwnProperty(key)) {
        set.call(SubClass, key, staticProps[key]);
      }
    }

    // Add proto props.
    for (var key in props) {
      if (props.hasOwnProperty(key))
        set.call(SubClass.prototype, key, props[key]);
    };

    return SubClass;
  };

  // Mixin to the object prototype.
  Base.mixin = function () {
    for (var i = 0; i <= arguments.length; i += 1) {
      var props = arguments[i];
      for (var key in props) {
        if (props.hasOwnProperty(key))
          this.prototype.set.call(this.prototype, key, props[key]);
      }
    }
    return this;
  };

  // Mixin static methods.
  Base.mixinStatic = function () {
    for (var i = 0; i <= arguments.length; i += 1) {
      var props = arguments[i];
      for (var key in props) {
        if (props.hasOwnProperty(key))
          this.prototype.set.call(this, key, props[key]);
      }
    }
    return this;
  };

  // Set a prototype method.
  Base.set = function () {
    this.prototype.set.apply(this.prototype, arguments);
  };

  // Ensure the correct constructor is set.
  Base.prototype.constructor = Base;

  // Set a property, wrapping it with a super call if
  // needed.
  Base.prototype.set = function (key, value) {
    var parentProp = this[key];
    this[key] = wrap(value, parentProp, this);
    return this;
  };

  // Get a property or method.
  Base.prototype.get = function (key) {
    return this[key];
  };

  return Base;

}));