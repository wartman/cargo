var expect = require('expect.js')
var Rabbit = require('../../../')
var Record = Rabbit.Record
var fs = require('fs')

describe('Rabbit.Record.IO', function () {

  describe('#load', function () {

    var io = new Record.IO()
    io.set('base path', __dirname + '/../../fixtures/data')

    it('loads files relative to the `base path` and provided collection', function (done) {
      io.load('test', '001').then(function (file) {
        expect(file).to.be.a('string')
        done()
      }).catch(done)
    })

    it('loads and entire collection if no file is passed', function (done) {
      io.load('test').then(function (files) {
        expect(files).to.be.an('object')
        // Note: these tests need to be more detailed. Already screwed me up once.
        expect(files['001.md']).to.be.a('string')
        expect(files['002.md']).to.be.a('string')
        done()
      }).catch(done)
    })

    it('throws a not-found error if the document or collection does not exist', function (done) {
      io.load('test', '900').then(function (file) {
        done(new Error('Did not fail'))
      }).catch(Rabbit.errors.NotFoundError, function (err) {
        expect(err).to.be.a(Rabbit.errors.NotFoundError)
        done()
      }).catch(done)
    })

  })

})