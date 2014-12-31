var expect = require('expect.js')
var rabbit = require('../../')
var setup = require('./setup')

describe('rabbit.db.Model', function () {
  
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

  })

})