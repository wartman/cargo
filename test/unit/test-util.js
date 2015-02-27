var expect = require('expect.js')
var Cargo = require('../../')
var util = Cargo.util

describe('Cargo.util', function () {

  describe('#createImporter', function () {

    it('creates an importer that loads all modules in a dir recursively', function () {
      var imports = Cargo.util.createImporter(__dirname)
      var actual = imports('../fixtures/util/importer')
      expect(actual).to.eql({
        foo: 'foo',
        bar: 'bar',
        recur: {
          fooBar: 'bar'
        }
      })
    })

    it('can use a transform option', function () {
      var imports = Cargo.util.createImporter(__dirname, {
        transform: function (str) {
          return util.capitalize(util.camelCase(str))
        }
      })
      var actual = imports('../fixtures/util/importer')
      expect(actual).to.eql({
        Foo: 'foo',
        Bar: 'bar',
        Recur: {
          FooBar: 'bar'
        }
      })
    })

  })

})
