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

    it('registers documents and collections using objects', function () {
      manifest.use({
        foo: Manifest.Document.extend(),
        bar: Manifest.Document.extend(),
        collect: Manifest.Collection.extend()
      })
      expect(manifest.documents.foo()).to.be.a(Manifest.Document)
      expect(manifest.documents.bar()).to.be.a(Manifest.Document)
      expect(manifest.collections.collect()).to.be.a(Manifest.Collection)
    })

    it('registers documents and collections using nested objects', function () {
      manifest.use({
        foo: Manifest.Document.extend(),
        bax: {
          fib: {
            bar: Manifest.Document.extend(),
          }
        },
        bin: {
          collect: Manifest.Collection.extend()
        }
      })
      expect(manifest.documents.foo()).to.be.a(Manifest.Document)
      expect(manifest.documents.bar()).to.be.a(Manifest.Document)
      expect(manifest.collections.collect()).to.be.a(Manifest.Collection)
    })

    it('sets up documents to use the correct IO', function () {
      expect(manifest.documents.test().io).to.eql(manifest.io)
      expect(manifest.documents.test().io.get('base path')).to.equal('test/path')
    })

    // @todo test collections

  })

})