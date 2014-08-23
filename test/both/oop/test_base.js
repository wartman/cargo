var Base = require('../../../lib/both/util/base');
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

  describe('#addProperty', function () {

    it('binds `this.sup` to parent method', function () {
      // addProperty is used internally by the extend method.
      var Foo = Base.extend({
        foo: function (name) {
          return 'sub: ' + name;
        }
      });
      var Bar = Foo.extend({
        foo: function (name) {
          return this.sup(name) + ' extended';
        }
      });
      var actual = new Bar();
      expect(actual.foo('hi')).to.equal('sub: hi extended');
    });

  });

})