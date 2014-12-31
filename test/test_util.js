var expect = require('expect.js')
var rabbit = require('../')

describe('rabbit.util', function () {

  describe('rabbit.util.createImporter', function () {

    it('creates an importer that loads all modules in a dir recursively', function () {
      var imports = rabbit.util.createImporter(__dirname)
      var actual = imports('./fixtures/util/importer')
      expect(actual).to.eql({
        foo: 'foo',
        bar: 'bar',
        recur: {
          fooBar: 'bar'
        }
      })
    })

  })

})
