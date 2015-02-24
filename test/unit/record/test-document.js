var expect = require('expect.js')
var Record = require('../../lib/record')
var Promise = require('bluebird')

describe('Rabbit.Record.Document', function () {
  
  describe('#constructor', function () {

    it('sets initial attributes', function () {
      var attrs = {foo: 'foo', bar: 'bar'}
      var doc = new Record.Document(attrs)
      expect(doc.attributes).to.deep.equal(attrs)
    })

  })

  describe('#set', function () {
    var doc = new Record.Document({})

    it('sets an attribute', function () {
      doc.set('foo', 'bar')
      expect(doc.attributes.foo).to.equal('bar')
    })

    it('sets attributes from a hash', function () {
      doc.set({
        bar: 'bar',
        baz: 'baz'
      })
      expect(doc.attributes.bar).to.equal('bar')
      expect(doc.attributes.baz).to.equal('baz')
    })

    it('is chainable', function () {
      expect(function () {
        doc
          .set('foo', 'bar')
          .set({fiz: 'bang', froop: 'frob'})
      }).to.not.throwException()
    })

    it('sets the `id` attribute', function () {
      doc.set(doc.idAttribute, 956)
      expect(doc.id).to.equal(956)
        .and.to.equal(doc.attributes[doc.idAttribute])
    })

  })

  describe('#get', function () {
    var doc = new Record.Document()

    it('gets an attribute', function () {
      doc.attribute.foo = 'foo'
      expect(doc.get('foo')).to.equal('foo') 
    })

    it('returns null if no attribute exists', function () {
      expect(doc.get('Barf')).to.be('null')
    })

  })

  describe('#has', function () {
    var doc = new Record.Document()

    it('returns true or false if an attribute exists/does not exist', function () {
      doc.set('foo', 'foo')
      expect(doc.has('foo')).to.be.true
      expect(doc.has('bar')).to.be.false
    })

  })

  describe('#parse', function () {

    it('parses TOML and Markdown into attributes', function () {
      var doc = new Record.Document()
      doc.parse([
        '---',
        'title = "Some Title"',
        'attachment = "some file"',
        '---',
        '##This is the title##',
        '',
        'This is a paragraph',
        '',
        'And so is this',
        'But this isn\'t'
      ].join('\n'))
      expect(doc.get('title')).to.equal('Some Title')
      expect(doc.get('attachment')).to.equal('some file')
      expect(doc.get('content')).to.equal([
        '<h2>This is the title</h2>',
        '<p>This is a paragraph</p>',
        '<p>And so is this.',
        'But this isn\'t</p>'
      ].join('\n'))
    })

  })

  describe('#fetch', function () {

    // Note: see integration tests for actual implementation.
    var Tester = Record.Document.extend({
      // Overwrite the 'load' method for unit testing.
      load: Promise.method(function (id) {
        switch(id) {
          case '001':
            return [
              '---',
              'title = "Hello World"',
              '---',
              'The grass is pretty green.'
            ].join('\n')
          case '002':
            return [
              '---',
              'title = "Hello Other World',
              '---',
              'The grass is greener here.'
            ].join('\n')
          default:
            throw new Error('Not found: ' + id)
        }
      })
    })

    it('loads from a file based on ID', function (done) {
      var test = new Tester({id: '001'})
      test.fetch().then(function () {
        expect(test.get('title')).to.equal('Hello World')
        expect(test.get('content')).to.not.be('null')
        done()
      }).catch(done)
    })

  })

})

// @todo
// For the next release:
// #save
// #pre and #post