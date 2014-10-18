var Base = require('./base').Base;
var mixins = require('./base').mixins;

// Singleton
// ---------
// Extend to create classes that have a 'getSingleton'
// static method.
var Singleton = Base.extend({}, mixins.singleton);

module.exports = Singleton;