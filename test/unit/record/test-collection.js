var expect = require('expect.js')
var Rabbit = require('../../../')
var Record = Rabbit.Record
var Promise = require('bluebird')

describe('Rabbit.Record.Collection', function () {

  describe('#constructor', function () {

    it('sets the collection\'s path', function () {
      var collection = new Record.Collection('foo')
      expect(collection.path).to.equal('foo')
    })

    it('uses a registered document\'s path if one is not provided', function () {
      var Test = Record.Document.extend({
        init: function () {
          this.path = 'foo/bar'
        }
      })
      var TestCollection = Record.Collection.extend({
        init: function () {
          this.document = Test
        }
      })
      var test = new TestCollection()
      expect(test.path).to.equal('foo/bar')
    })

  })

  describe('#add', function () {

    it('adds a Record.Document to the collection', function () {
      var collection = new Record.Collection()
      collection.add(new Record.Document({id: '001', foo: 'bar'}))
      expect(collection.get('001').attributes).to.eql({id: '001', foo: 'bar'})
    })

    it('adds a hash to the collection, and parses it into the registered Document', function () {
      var TestDoc = Record.Document.extend({
        constructor: function (attributes, options) {
          attributes || (attributes = {})
          attributes.bif = 'bif'
          this.super(attributes, options)
        }
      })
      var Test = Record.Collection.extend({
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

  })

  describe('#get', function () {

    it('gets a registered Document from the collection by ID', function () {
      var doc = new Record.Document({id: '001', name: 'foo'})
      var collection = new Record.Collection()
      collection.add(doc)
      expect(collection.get('001')).to.eql(doc)
    })

    it('gets a registered Document by model', function () {
      var doc = new Record.Document({id: '001', name: 'foo'})
      var collection = new Record.Collection()
      collection.add(doc)
      expect(collection.get(doc)).to.eql(doc)
    })

  })

  describe('#at', function () {

    it('gets a registered Document by its index', function () {
      var doc1 = new Record.Document({id: '001', name: 'foo'})
      var doc2 = new Record.Document({id: '002', name: 'bar'})
      var collection = new Record.Collection()
      collection.add(doc1).add(doc2)
      expect(collection.at(0)).to.eql(doc1)
      expect(collection.at(1)).to.eql(doc2)
    })

  })

  describe('#toJSON', function () {

    it('outputs documents as JSON', function () {
      var collection = new Record.Collection()
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
      var doc1 = new Record.Document({id: '001', name: 'foo'})
      var doc2 = new Record.Document({id: '002', name: 'bar'})
      var collection = new Record.Collection()
      collection.add(doc1).add(doc2)
      var i = 0
      collection.each(function (doc) {
        expect(collection.at(i)).to.eql(doc)
        i++
      })
    })

  })

  describe('#fetch', function () {
    var fixtures = {
      '001.md': [
        '---',
        'title: Hello World',
        '---',
        'The grass is pretty green.'
      ].join('\n'),
      '002.md': [
        '---',
        'title: Hello World Again',
        '---',
        'The grass is greener.'
      ].join('\n')
    }

    // Override the loader with a test
    var Test = Record.Collection.extend({
      load: Promise.method(function () {
        return fixtures
      })
    })

    it('loads all files in a collection', function (done) {
      var collection = new Test('bar')
      collection.fetch().then(function (arg) {
        expect(arg).to.eql(collection)
        expect(collection.get('001')).to.be.a(Record.Document)
        expect(collection.get('002')).to.be.a(Record.Document)
        done()
      }).catch(done)
    })

  })

})