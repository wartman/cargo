var expect = require('expect.js')
var rabbit = require('../../')
var util = rabbit.util

describe('rabbit.util', function () {

  describe('#createImporter', function () {

    it('creates an importer that loads all modules in a dir recursively', function () {
      var imports = rabbit.util.createImporter(__dirname)
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
      var imports = rabbit.util.createImporter(__dirname, {
        transform: function (str) {
          return util.capitalize(util.camelCase(str))
        }
      })
      var actual = imports('../fixtures/util/importer')
      expect(actual).to.eql({
        Foo: 'foo',
        Bar: 'bar',
        recur: {
          FooBar: 'bar'
        }
      })
    })

  })

})
