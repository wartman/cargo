var expect = require('expect.js')
var rabbit = require('../')

describe('rabbit.Set', function () {

  describe('#constructor', function () {

    it('populates default options', function () {
      var test = new rabbit.Set({
        foo: 'foo',
        bar: 'bar'
      })
      expect(test.get('foo')).to.be('foo')
      expect(test.get('bar')).to.be('bar')
    })

    it('uses second argument to overwrite defaults', function () {
      var test = new rabbit.Set({
        foo: 'foo',
        bar: 'bar'
      }, {
        bar: 'foo'
      })
      expect(test.get('foo')).to.be('foo')
      expect(test.get('bar')).to.be('foo')
    })

  })
  
  describe('#get', function () {

    it('gets options', function () {
      var test = new rabbit.Set()
      test.set('foo', 'bar')
      expect(test.get('foo')).to.be('bar')
      expect(test.get('bar')).to.be(undefined)
    })

    it('returns a default if undefined', function () {
      var test = new rabbit.Set()
      expect(test.get('foo', 'bar')).to.be('bar')
    })

    it('returns several keys if an array is passed', function () {
      var test = new rabbit.Set()
      var vals = {
        foo: 'foo',
        bar: 'bar',
        bin: 'bin'
      }
      test.set(vals)
      expect(test.get(['foo', 'bar', 'bin'])).to.eql(vals)
    })

  })

  describe('#set', function () {

    it('sets a key', function () {
      var test = new rabbit.Set()
      test.set('foo', 'bar')
      expect(test.get('foo')).to.be('bar')
    })

    it('sets many keys when an Object Literal is passed', function () {
      var test = new rabbit.Set()
      test.set({
        foo: 'foo',
        bar: 'bar',
        bin: 'bin'
      })
      expect(test.get('foo')).to.be('foo')
      expect(test.get('bar')).to.be('bar')
      expect(test.get('bin')).to.be('bin')
    })

  })

  describe('#defineOption', function () {

    it('registers custom getters and setters', function () {
      var test = new rabbit.Set()
      test.defineOption('foo', {
        set: function (value) {
          this._foo = value
        },
        get: function () {
          return this._foo
        }
      })
      test.set('foo', 'bar')
      expect(test.get('foo')).to.be('bar')
      expect(test._foo).to.be('bar')
    })

    it('modifies values by returning them', function () {
      var test = new rabbit.Set()
      test.defineOption('foo', {
        set: function (value) {
          return value + 'bar'
        },
        get: function (value) {
          return 'foo' + value
        }
      })
      test.set('foo', ' is ')
      expect(test.get('foo')).to.be('foo is bar')
    })

  })

})
