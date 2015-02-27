var expect = require('expect.js')
var Cargo = require('../../../')
var Manifest = Cargo.Manifest
var Promise = require('bluebird')

describe('Cargo.Manifest.Collection', function () {

  describe('#constructor', function () {

    it('sets the collection\'s path', function () {
      var collection = new Manifest.Collection('foo')
      expect(collection.path).to.equal('foo')
    })

    it('uses a registered document\'s path if one is not provided', function () {
      var Test = Manifest.Document.extend({
        init: function () {
          this.path = 'foo/bar'
        }
      })
      var TestCollection = Manifest.Collection.extend({
        init: function () {
          this.document = Test
        }
      })
      var test = new TestCollection()
      expect(test.path).to.equal('foo/bar')
    })

  })

  describe('#add', function () {

    it('adds a Manifest.Document to the collection', function () {
      var collection = new Manifest.Collection()
      collection.add(new Manifest.Document({id: '001', foo: 'bar'}))
      expect(collection.get('001').attributes).to.eql({id: '001', foo: 'bar'})
    })

    it('adds a hash to the collection, and parses it into the registered Document', function () {
      var TestDoc = Manifest.Document.extend({
        constructor: function (attributes, options) {
          attributes || (attributes = {})
          attributes.bif = 'bif'
          this.super(attributes, options)
        }
      })
      var Test = Manifest.Collection.extend({
        constructor: function (documents, options) {
          this.document = TestDoc 
          this.super(documents, options)
        }
      })
      var collection = new Test()
      collection
        .add({id: '001', foo: 'bar'})
        .add({id: '002', foo: 'bin'})
      expect(collection.get('001')).to.be.a(TestDoc)
      expect(collection.get('001').get('foo')).to.equal('bar')
      expect(collection.get('002').get('foo')).to.equal('bin')
    })

    it('causes child-documents to inherit it\'s $map, path, etc.', function () {
      var Test = Manifest.Collection.extend({
        init: function () {
          this.path = 'foo/bar'
          this.$map = {id: 0, name: 1, bar: 2}
        }
      })
      var test = new Test()
      test.add({id: '001', name: 'foo'})
      expect(test.get('001').$map).to.eql(test.$map)
      expect(test.get('001').path).to.eql(test.path)
    })

  })

  describe('#get', function () {

    it('gets a registered Document from the collection by ID', function () {
      var doc = new Manifest.Document({id: '001', name: 'foo'})
      var collection = new Manifest.Collection()
      collection.add(doc)
      expect(collection.get('001')).to.eql(doc)
    })

    it('gets a registered Document by model', function () {
      var doc = new Manifest.Document({id: '001', name: 'foo'})
      var collection = new Manifest.Collection()
      collection.add(doc)
      expect(collection.get(doc)).to.eql(doc)
    })

  })

  describe('#at', function () {

    it('gets a registered Document by its index', function () {
      var doc1 = new Manifest.Document({id: '001', name: 'foo'})
      var doc2 = new Manifest.Document({id: '002', name: 'bar'})
      var collection = new Manifest.Collection()
      collection.add(doc1).add(doc2)
      expect(collection.at(0)).to.eql(doc1)
      expect(collection.at(1)).to.eql(doc2)
    })

  })

  describe('#toJSON', function () {

    it('outputs documents as JSON', function () {
      var collection = new Manifest.Collection()
      collection
        .add({id:1, value: 'foo'})
        .add({id:2, value: 'bar'})
        .add({id:3, value: 'bax'})
      expect(collection.toJSON()).to.eql([
        {id:1, value: 'foo'},
        {id:2, value: 'bar'},
        {id:3, value: 'bax'}
      ])
    })

  })

  describe('#each', function () {

    it('iterates over registered Documents', function () {
      var doc1 = new Manifest.Document({id: '001', name: 'foo'})
      var doc2 = new Manifest.Document({id: '002', name: 'bar'})
      var collection = new Manifest.Collection()
      collection.add(doc1).add(doc2)
      var i = 0
      collection.each(function (doc) {
        expect(collection.at(i)).to.eql(doc)
        i++
      })
    })

  })

  describe('#fetch', function () {
    var fixtures = [
      {
        filename: '001.md',
        contents: [
          '---',
          'title: Hello World',
          '---',
          'The grass is pretty green.'
        ].join('\n')
      },
      {
        filename: '002.md',
        contents: [
          '---',
          'title: Hello World Again',
          '---',
          'The grass is greener.'
        ].join('\n')
      }
    ]

    // Override the loader with a test
    var Test = Manifest.Collection.extend({
      load: Promise.method(function () {
        return fixtures
      })
    })

    it('loads all files in a collection', function (done) {
      var collection = new Test('bar')
      collection.fetch().then(function (arg) {
        expect(arg).to.eql(collection)
        expect(collection.get('001')).to.be.a(Manifest.Document)
        expect(collection.get('002')).to.be.a(Manifest.Document)
        done()
      }).catch(done)
    })

  })

})