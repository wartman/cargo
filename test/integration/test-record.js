var expect = require('expect.js')
var Rabbit = require('../../')
var Record = Rabbit.Record

describe('Rabbit.Record', function () {
  
  var record = new Record({
    'base path': __dirname + '/../fixtures/data'
  })
  record.use('test', Record.Collection.extend({
    init: function () {
      this.path = 'test'
    }
  }))
  
  it('loads files and parses them', function (done) {
    var collection = record.collections.test()
    collection.fetch().then(function (arg) {
      expect(arg).to.eql(collection)
      expect(collection.get('001')).to.be.a(Record.Document)
      expect(collection.get('002')).to.be.a(Record.Document)
      expect(collection.get('001').get('name')).to.be('First')
      expect(collection.get('002').get('name')).to.be('Second')
      done()
    }).catch(done)
  })

})
