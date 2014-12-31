var expect = require('expect.js')
var rabbit = require('../../')

var Field = rabbit.db.Field
var fields = rabbit.db.fields

describe('rabbit.db.Field', function () {
  
  describe('#attributes', function () {
    // ?
  })

  describe('#toColumn', function () {
    // ?
  })

})

describe('rabbit.db.fields', function () {

  describe('#integer', function () {

    it('validates as an integer', function () {
      var testInt = fields.integer()
      expect(testInt.validate(1)).to.be(true)
      expect(testInt.validate('1')).to.be(true)
      expect(testInt.validate('HEY')).to.be(false)
    })

  })

})