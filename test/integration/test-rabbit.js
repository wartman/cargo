var express = require('express')
var expect = require('expect.js')
var request = require('supertest')
var Rabbit = require('../../')

var rabbitOptions = {
  'module root': __dirname + '/../',
  'record path': 'fixtures/data',
  'static path': 'public'
}
var rabbit

describe('Rabbit', function () {

  describe('#init', function () {

    beforeEach(function () {
      rabbit = new Rabbit(rabbitOptions)
    })

    it('sets up the app, binding routes', function (done) {
      rabbit.set('routes', function (app) {
        app.get('/', function (req, res) {
          res.send('hello world')
        })
      })
      request(rabbit.init().app)
        .get('/')
        .expect('hello world', done)
    })

    it('makes documents/collections available to routes as middleware', function (done) {
      rabbit.set('models', function (record) {
        record.use('test', Rabbit.Record.Document.extend({
          init: function () {
            this.path = 'test'
          }
        }))
      })
      rabbit.set('routes', function (app) {
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
      request(rabbit.init().app)
        .get('/doc/001')
        .expect('First', done)
    })

  })

  describe('#mount', function () {

    beforeEach(function () {
      rabbit = new Rabbit(rabbitOptions)
    })

    it('mounts rabbit as middleware', function (done) {
      var testApp = express()
      rabbit.set('routes', function (app) {
        app.get('/hello', function (req, res) {
          res.send('hello world')
        })
      })
      rabbit.mount('/testable', testApp)
      request(testApp)
        .get('/testable/hello')
        .expect('hello world', done)
    })

  })

})