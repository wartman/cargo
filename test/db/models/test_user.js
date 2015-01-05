var expect = require('expect.js')
var rabbit = require('../../../')
var setup = require('../setup')

describe('model/User', function () {
  
  before(function (done) {
    setup.connectToDb().then(function () {
      done()
    }).catch(done)
  })

  describe('#authenticate', function () {

    it('validates correct authentication', function (done) {
      rabbit.db.model('User').authenticate('tester', 'test')
        .then(function (model) {
          expect(model.get('username')).to.equal('tester')
          expect(model.get('firstname')).to.equal('Testy')
          done()
        })
        .catch(done)
    })

    it('returns an error otherwise', function (done) {
      rabbit.db.model('User').authenticate('tester', 'foobar')
        .then(function (model) {
          done(new Error('Should not have logged in'))
        })
        .catch(function (err) {
          expect(err.code).to.equal(401)
          expect(err.name).to.equal('UnauthorizedError')
          done()
        })
    })

  })

  describe('#isAuthed', function () {

  })

})