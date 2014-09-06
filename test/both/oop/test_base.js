var Base = require('../../../lib/both/oop/base');
var expect = require('chai').expect;

describe('Base', function () {

  describe('#extend', function () {

    it('extends properties', function () {
      var Foo = Base.extend({
        foo: 'foo',
        bar: 'bar'
      });
      var actual = new Foo();
      expect(actual.foo).to.equal('foo');
      expect(actual.bar).to.equal('bar');
      var Bar = Foo.extend({
        bar: 'extended'
      });
      actual = new Bar();
      expect(actual.foo).to.equal('foo');
      expect(actual.bar).to.equal('extended');
    });

    it('defines constructors', function () {
      var Foo = Base.extend({
        constructor: function (name) {
          this.foo = name;
        }
      });
      var actual = new Foo('foo');
      expect(actual.foo).to.equal('foo');
      actual = new Foo('bar');
      expect(actual.foo).to.equal('bar');
    });

    it('inherits constructors', function () {
      var Foo = Base.extend({
        constructor: function (name) {
          this.foo = name;
        }
      });
      var Bar = Foo.extend({});
      var actual = new Bar('foo');
      expect(actual.foo).to.equal('foo');
      actual = new Bar('bar');
      expect(actual.foo).to.equal('bar');
    });

    it('can use functions', function () {
      var Foo = Base.extend(function () {
        this.foo = function () {
          return 'foo'
        }
      });
      var actual = new Foo();
      expect(actual.foo()).to.equal('foo');
    });

  });

  describe('#mixin', function () {

    it('mixins many objects', function () {
      var Foo = Base.extend({
        foo: 'foo'
      });
      var Bar = Foo.extend({
        bar : 'bar'
      }).mixin({
        bin: 'bin'
      }, {
        bax: 'bax'
      });
      var actual = new Bar();
      expect(actual.foo).to.equal('foo');
      expect(actual.bar).to.equal('bar');
      expect(actual.bin).to.equal('bin');
      expect(actual.bax).to.equal('bax');
    });

  });

  describe('#mixinStatic', function () {
      
    it('adds class properties', function () {
      var Foo = Base.extend({
        foo: 'foo'
      }, {
        foo: 'foo'
      });
      var Bar = Foo.extend({
        bar: 'bar'
      });
      Bar.mixinStatic({
        foo: 'bar'
      }, {
        bar: 'bar'
      });
      expect(Bar.foo).to.equal('bar');
      expect(Bar.bar).to.equal('bar');
    });

  });

  describe('#set', function () {

    it('binds `this.sup` to parent method', function () {
      // set is used internally by the extend method.
      var Foo = Base.extend({
        foo: function (name) {
          return 'sub: ' + name;
        },
        bar: function () {
          return 'bar';
        }
      });
      var Bar = Foo.extend({
        foo: function (name) {
          return this.sup(name) + ' extended';
        }
      });
      Bar.set('bar', function () {
        return this.sup() + ' extended';
      });
      var actual = new Bar();
      expect(actual.foo('hi')).to.equal('sub: hi extended');
      expect(actual.bar()).to.equal('bar extended');
    });

  });

});