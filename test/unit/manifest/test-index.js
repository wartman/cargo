var expect = require('expect.js')
var Cargo = require('../../../')
var Manifest = Cargo.Manifest

describe('Cargo.Manifest', function () {
  
  describe('#constructor', function () {

  })

  describe('#connect', function () {

  })

  describe('#use', function () {

    var manifest
    var Test

    beforeEach(function () {
      manifest = new Manifest({
        'base path': 'test/path'
      })
      Test = Manifest.Document.extend({
        init: function () {
          this.path = 'test'
        }
      })
      manifest.use('test', Test)
    })

    it('registers documents', function () {
      expect(manifest.documents.test).to.be.a('function')
      expect(manifest.documents.test()).to.be.a(Test)
      expect(manifest.documents.test({
        'id': '001', 
        'foo': 'bar'
      }).get('foo')).to.equal('bar')
    })

    it('registered documents have the correct IO', function () {
      expect(manifest.documents.test().io).to.eql(manifest.io)
      expect(manifest.documents.test().io.get('base path')).to.equal('test/path')
    })

    // @todo test collections

  })

})