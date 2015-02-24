var expect = require('expect.js')
var rabbit = require('../../../')
var Record = rabbit.Record
var fs = require('fs')

describe('Rabbit.Record.Loader', function () {

  describe('.getInstance', function () {

    it('returns an instance', function () {
      var loader = Record.Loader.getInstance()
      expect(loader).to.be.a(Record.Loader) 
    })

  })

  describe('#load', function () {

    var loader = Record.Loader.getInstance()
    loader.set('base path', __dirname + '/../../fixtures/data')

    it('loads files relative to the `base path` and provided collection', function (done) {
      loader.load('test', '001').then(function (file) {
        expect(file).to.be.a('string')
        done()
      }).catch(done)
    })

    it('loads and entire collection if no file is passed', function (done) {
      loader.load('test').then(function (files) {
        expect(files).to.be.an('object')
        // Note: these tests need to be more detailed. Already screwed me up once.
        expect(files['001.md']).to.be.a('string')
        expect(files['002.md']).to.be.a('string')
        done()
      }).catch(done)
    })

    it('throws a not-found error if the document or collection does not exist', function (done) {
      loader.load('test', '900').then(function (file) {
        done(new Error('Did not fail'))
      }).catch(rabbit.errors.NotFoundError, function (err) {
        expect(err).to.be.a(rabbit.errors.NotFoundError)
        done()
      }).catch(done)
    })

  })

})