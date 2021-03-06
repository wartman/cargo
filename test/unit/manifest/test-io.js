var expect = require('expect.js')
var Cargo = require('../../../')
var Manifest = Cargo.Manifest
var fs = require('fs')

describe('Cargo.Manifest.IO', function () {

  var io = new Manifest.IO()
  io.set('base path', __dirname + '/../../fixtures/data')

  describe('#load', function () {

    it('loads files relative to the `base path` and provided collection', function (done) {
      io.load('test', '001').then(function (file) {
        expect(file).to.be.a('object')
        expect(file.filename).to.be.a('string')
        expect(file.contents).to.be.a('string')
        done()
      }).catch(done)
    })

    it('loads an entire collection if no file is passed', function (done) {
      io.load('test').then(function (files) {
        expect(files).to.be.an('array')
        // Note: these tests need to be more detailed. Already screwed me up once.
        expect(files[0].filename).to.equal('001.md')
        expect(files[0].contents).to.be.a('string')
        expect(files[1].filename).to.equal('002.md')
        expect(files[1].contents).to.be.a('string')
        done()
      }).catch(done)
    })

    it('filters query if passed', function (done) {
      io.load('test', {query: {id: '001'}, single: true}).then(function (file) {
        expect(file.filename).to.equal('001.md')
        expect(file.contents).to.be.a('string')
        done()
      }).catch(done)
    })

    it('throws a not-found error if the document or collection does not exist', function (done) {
      io.load('test', '900').then(function (file) {
        done(new Error('Did not fail'))
      }).catch(Cargo.errors.NotFoundError, function (err) {
        // What we expect.
        done()
      }).catch(done)
    })

  })

  describe('#query', function () {

    it('filters an array of filenames based on `$startAtId` and `$limit`', function () {
      expect(io.query({$startAtId: '002', $limit: 3}, ['001.md', '002.hey.md', '003.md', '004.md', '005.md', '006.md']))
        .to.eql(['002.hey.md', '003.md', '004.md'])
    })

    it('filters an array of filenames based on `$startAtIndex` and `$limit`', function () {
      // Remember: 0-indexed!
      expect(io.query({$startAtIndex: 1, $limit: 3}, ['001.md', '002.hey.md', '003.md', '004.md', '005.md', '006.md']))
        .to.eql(['002.hey.md', '003.md', '004.md'])
    })

    it('filters for files that contain a match', function () {
      expect(io.query({$contains: 'hello'}, ['001.hello.md', '002.goodbye.md', '003.foo.hello.md']))
        .to.eql(['001.hello.md', '003.foo.hello.md'])
    })

    it('discovers files by ID automatically (assumes id position === 1, and the id attribute === "id")', function () {
      expect(io.query({id: '002'}, ['001.hello.md', '002.goodbye.md', '003.hello-man.md']))
        .to.eql(['002.goodbye.md'])
    })

    it('can create custom searches with `$map`', function () {
      expect(io.query({name: 'foo', cat: 'bar', $map: {name: 1, cat: 2}}, ['001.foo.bin.md', '002.foo.bar.md']))
        .to.eql(['002.foo.bar.md'])
    })

  })

})