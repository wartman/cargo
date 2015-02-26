var expect = require('expect.js')
var Rabbit = require('../../')

describe('Rabbit', function () {

  describe('#constructor', function () {

    it('returns an instance without `new`', function () {
      var rabbit = Rabbit()
      expect(rabbit).to.be.a(Rabbit)
    })

  })

  describe('#get', function () {

    it('gets an option', function () {
      
    })

  })

  describe('#set', function () {

  })

  describe('#getPath', function () {

  })

})