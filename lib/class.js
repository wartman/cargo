// Class
// -----
// A simple class system, based on:
//     http://blog.salsify.com/engineering/super-methods-in-javascript
// Should be replaced with es6 classes as soon as applicable.
// Because this implementation requires es5+ methods, it is not
// ready for client-side apps.
var Class = function () {}

// Extend a class. To mimic es6 classes as much as possible, only
// functions are allowed in the class prototype, and class-methods
// must be defined directly on the constructor.
Class.extend = function extend(source) {
  source || (source = {})
  var parent = this
  var SubClass = (source.hasOwnProperty('constructor'))
    ? source.constructor 
    : function Class() { // Named for prettier console logging
      parent.apply(this, arguments)
    }
  SubClass.prototype = Object.create(parent.prototype)
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if ('function' !== typeof source[key]) {
        throw new Error('Class.extend() Error: Only functions should be '
          + 'present in class prototypes (this is to mimic es6 classes)')
      }
      SubClass.prototype[key] = source[key]
      SubClass.prototype[key].__methodName = key
    }
  }
  SubClass.prototype.constructor = SubClass
  SubClass.extend = extend
  return SubClass
}

// Super methods
Object.defineProperty(Class.prototype, 'super', {
  get: function get() {
    var impl = get.caller // Yep, will be depreciated in es6
    var name = impl.__methodName
    var foundImpl = this[name] === impl
    var proto = this

    // Search through the prototype chain until a matching method is found
    while (proto = Object.getPrototypeOf(proto)) {
      if (!proto[name]) {
        break
      } else if (proto[name] === impl) {
        // If this is the current method, then use the next matching
        // method down the prototype chain.
        foundImpl = true
      } else if (foundImpl) {
        return proto[name]
      }
    }
    if (!foundImpl) throw "`super` may not be called outside a method implementation"
  }
})

module.exports = Class
