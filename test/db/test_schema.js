var expect = require('expect.js')
var rabbit = require('../../')
var setup = require('./setup')

describe('rabbit.db.Schema', function () {
  
  before(function (done) {
    setup.connectToDb().then(function () {
      done()
    }).catch(done)
  })

  describe('test', function () {

    it('is a dumb test', function () {
      expect(rabbit.db.model('Test')).not.to.be(undefined)
      expect(rabbit.db.model('Setting')).not.to.be(undefined)
    })

    it('saves shit', function (done) {
      rabbit.db.model('Test', {
        name: 'foo',
        content: 'bar',
        number: 1
      }).save().then(function (model) {
        expect(model.get('name')).to.equal('foo')
        done()
      }).catch(done)
    })

    it('loaded update', function (done) {
      rabbit.db.model('Test', {
        name: 'update',
      }).fetch().then(function (model) {
        if (!model) return done(new Error('Not found'))
        expect(model.get('name')).to.equal('update')
        expect(model.get('content')).to.equal('updated')
        rabbit.db.model('Setting', {
          key: 'updateVersion'
        }).fetch().then(function (model) {
          if (!model) return done(new Error('Not found'))
          expect(model.get('value')).to.equal('0.0.1-testing')
          done()
        }).catch(done)
      }).catch(done)
    })

  })

})