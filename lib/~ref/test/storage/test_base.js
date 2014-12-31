var expect = require('chai').expect;
var moment = require('moment');
var Promise = require('bluebird');
var StorageBase = require('../../storage/base');

describe('storage/StorageBase', function () {
  
  var storage = StorageBase.getInstance();

  var mockStore = {
    fileExists: false,
    exists: function (filename) {
      if (this.fileExists) {
        this.fileExists = false;
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }
  } 

  describe('#getTargetDir', function () {

    it('gets a directory organized based on the current year/month', function () {
      var m = moment(new Date().getTime());
      var month = m.format('MM');
      var year = m.format('YYYY');
      expect(storage.getTargetDir('base').replace(/\\/g, '/')).to.equal('base/' + year + '/' + month);
    });

  });

  describe('#generateUnique', function () {

    it('generates a unique id for a filename', function (done) {
      mockStore.fileExists = false;
      storage.generateUnique(mockStore, 'base', 'foo', '.gif', 0)
        .then(function (filename) {
          expect(filename.replace(/\\/g, '/')).to.equal('base/foo.gif');
          done();
        });
    });

    it('appends an integer if a file exists with the same name', function (done) {
      mockStore.fileExists = true;
      storage.generateUnique(mockStore, 'base', 'foo', '.gif', 0)
      .then(function (filename) {
        expect(filename.replace(/\\/g, '/')).to.equal('base/foo-1.gif');
        done();
      })
    });

  });

  describe('#getUniqueFilename', function () {

    it('parses a unique filename', function (done) {
      mockStore.fileExists = false;
      storage.getUniqueFilename(mockStore, {
        name: 'foo/bin/foo bar.gif'
      }, 'base')
        .then(function (filename) {
          expect(filename.replace(/\\/g, '/')).to.equal('base/foo-bar.gif');
          done();
        });
    });

  });  

});