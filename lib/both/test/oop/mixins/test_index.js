var Base = require('../../../oop/base');
var mixins = require('../../../oop/mixins');
var expect = require('chai').expect;

describe('mixins.singleton', function () {
  
  var Singleton = Base.extend({
    constructor: function (foo, bar) {
      this.foo = foo;
      this.bar = bar;
    }
  }, mixins.singleton);

  describe('#setInstance', function () {

    it('sets an instance, beleive it or not, '
       + 'passing all arguments to constructor', function () {
      Singleton.setInstance('bar', 'foo');
      var single = Singleton.getInstance();
      expect(single.foo).to.equal('bar');
      expect(single.bar).to.equal('foo');
      Singleton.setInstance('foo', 'bar');
      var single = Singleton.getInstance();
      expect(single.foo).to.equal('foo');
      expect(single.bar).to.equal('bar');
    });

  });

  describe('#getInstance', function () {

    it('gets an instance which remains static', function () {
      Singleton.setInstance('foo', 'bar');
      var single = Singleton.getInstance();
      var single2 = Singleton.getInstance();
      var single3 = Singleton.getInstance();
      expect(single.foo).to.equal('foo');
      expect(single.bar).to.equal('bar');
      expect(single).to.deep.equal(single2);
      expect(single2).to.deep.equal(single3);
    });

  });

});