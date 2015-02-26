var expect = require('expect.js')
var Rabbit = require('../../../')
var Record = Rabbit.Record
var fs = require('fs')

describe('Rabbit.Record.IO', function () {

  var io = new Record.IO()
  io.set('base path', __dirname + '/../../fixtures/data')

  describe('#load', function () {

    it('loads files relative to the `base path` and provided collection', function (done) {
      io.load('test', '001').then(function (file) {
        expect(file).to.be.a('string')
        done()
      }).catch(done)
    })

    it('loads an entire collection if no file is passed', function (done) {
      io.load('test').then(function (files) {
        expect(files).to.be.an('object')
        // Note: these tests need to be more detailed. Already screwed me up once.
        expect(files['001.md']).to.be.a('string')
        expect(files['002.md']).to.be.a('string')
        done()
      }).catch(done)
    })

    it('filters query if passed', function (done) {
      io.load('test', {query: {id: '001'}, single: true}).then(function (file) {
        expect(file).to.be.a('string')
        done()
      }).catch(done)
    })

    it('throws a not-found error if the document or collection does not exist', function (done) {
      io.load('test', '900').then(function (file) {
        done(new Error('Did not fail'))
      }).catch(Rabbit.errors.NotFoundError, function (err) {
        // What we expect.
        done()
      }).catch(done)
    })

  })

  describe('#query', function () {

    it('filters an array of filenames based on start and limit', function () {
      expect(io.query({start: '002', limit: 3}, ['001.md', '002.hey.md', '003.md', '004.md', '005.md', '006.md']))
        .to.eql(['002.hey.md', '003.md', '004.md'])
    })

    it('filters for files that contain a match', function () {
      expect(io.query({contains: 'hello'}, ['001.hello.md', '002.goodbye.md', '003.hello-man.md']))
        .to.eql(['001.hello.md', '003.hello-man.md'])
    })

  })

})