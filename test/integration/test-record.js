var expect = require('expect.js')
var rabbit = require('../../')
var Record = rabbit.Record

describe('Rabbit.Record', function () {
  
  Record.Loader
    .getInstance()
    .set('base path', __dirname + '/../fixtures/data')
  
  it('loads files and parses them', function (done) {
    var collection = new Record.Collection('test')
    collection.fetch().then(function () {
      expect(collection.get('001')).to.be.a(Record.Document)
      expect(collection.get('002')).to.be.a(Record.Document)
      expect(collection.get('001').get('name')).to.be('First')
      expect(collection.get('002').get('name')).to.be('Second')
      done()
    }).catch(done)
  })

})
