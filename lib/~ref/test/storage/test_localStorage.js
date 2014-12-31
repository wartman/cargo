var path = require('path');
var expect = require('chai').expect;
var LocalStorage = require('../../storage/localStorage');

describe('storage/LocalStorage', function () {
  
  var storage = new LocalStorage({
    baseDir: path.join(__dirname, 'fixtures') 
  });

  // NOTE:
  // Not doing much until we can get some fixtures in here.

  describe('save', function () {
    // to do
  });

  describe('exists', function () {
    // to do
  });

});