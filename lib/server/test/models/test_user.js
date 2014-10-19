var expect = require('chai').expect;

var utils = require('../testUtils');
var User = require('../../models/user').User;
var errors = require('../../errors');

describe('models/User', function () {

  before(utils.setup);

  before(function (done) {
    // todo: move this data to an external fixtures file.
    User.add({
      username: 'admin',
      firstname: 'Peter',
      lastname: 'Wartman',
      email: 'pw@peterwartman.com',
      role: 'Owner',
      password: 'admin'
    }).then(function () {
      done();
    })
    .catch(function (err) {
      throw err;
      done();
    });
  });

  describe('#authenticate', function () {

    it('authenticates a user with a username and password', function (done) {
      User.authenticate('admin', 'admin').then(function (user) {
        expect(user.isAuthed()).to.be.true;
        expect(user.get('firstname')).to.equal('Peter');
        done();
      })
      .catch(utils.catchError(done));
    });

    it('throws an error if the wrong password is provided', function (done) {
      User.authenticate('admin', 'foo').then(function () {
        throw new Error('Should throw an error!');
        done();
      }).catch(function (err) {
        expect(err).to.be.an.instanceOf(errors.NotAuthorizedError);
        done();
      })
    });

    it('throws an error if the wrong username is provided', function (done) {
      User.authenticate('foo', 'admin').then(function () {
        throw new Error('Should throw an error!');
        done();
      }).catch(function (err) {
        expect(err).to.be.an.instanceOf(errors.NotFoundError);
        done();
      })
    });

  });

})