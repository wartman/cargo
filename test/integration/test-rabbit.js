var express = require('express')
var expect = require('expect.js')
var request = require('supertest')
var Cargo = require('../../')

var rabbitOptions = {
  'module root': __dirname + '/../',
  'manifest path': 'fixtures/data',
  'static path': 'public'
}
var cargo

describe('Cargo', function () {

  describe('#init', function () {

    beforeEach(function () {
      cargo = new Cargo(rabbitOptions)
    })

    it('sets up the app, binding routes', function (done) {
      cargo.set('routes', function (app) {
        app.get('/', function (req, res) {
          res.send('hello world')
        })
      })
      request(cargo.init().app)
        .get('/')
        .expect('hello world', done)
    })

    it('makes documents/collections available to routes as middleware', function (done) {
      cargo.set('models', function (manifest) {
        manifest.use('test', Cargo.Manifest.Document.extend({
          init: function () {
            this.path = 'test'
          }
        }))
      })
      cargo.set('routes', function (app) {
        app.get('/doc/:id', function (req, res) {
          req.documents.test(req.params.id)
            .fetch()
            .then(function (doc) {
              res.send(doc.get('name'))
            }).catch(function (err) {
              res.send(err)
            })
        })
      })
      request(cargo.init().app)
        .get('/doc/001')
        .expect('First', done)
    })

  })

  describe('#mount', function () {

    beforeEach(function () {
      cargo = new Cargo(rabbitOptions)
    })

    it('mounts cargo as middleware', function (done) {
      var testApp = express()
      cargo.set('routes', function (app) {
        app.get('/hello', function (req, res) {
          res.send('hello world')
        })
      })
      cargo.mount('/testable', testApp)
      request(testApp)
        .get('/testable/hello')
        .expect('hello world', done)
    })

  })

})