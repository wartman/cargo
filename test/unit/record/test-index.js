var expect = require('expect.js')
var Rabbit = require('../../../')
var Record = Rabbit.Record

describe('Rabbit.Record', function () {
  
  describe('#constructor', function () {

  })

  describe('#connect', function () {

  })

  describe('#use', function () {

    var record
    var Test

    beforeEach(function () {
      record = new Record({
        'base path': 'test/path'
      })
      Test = Record.Document.extend({
        init: function () {
          this.path = 'test'
        }
      })
      record.use('test', Test)
    })

    it('registers documents', function () {
      expect(record.documents.test).to.be.a('function')
      expect(record.documents.test()).to.be.a(Test)
      expect(record.documents.test({
        'id': '001', 
        'foo': 'bar'
      }).get('foo')).to.equal('bar')
    })

    it('registered documents have the correct IO', function () {
      expect(record.documents.test().io).to.eql(record.io)
      expect(record.documents.test().io.get('base path')).to.equal('test/path')
    })

    // @todo test collections

  })

})