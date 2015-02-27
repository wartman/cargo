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
  record.use('advanced', Record.Collection.extend({
    init: function () {
      this.path = 'advanced'
      this.$map = {id: 0, name: 1}
    }
  }))
  record.use('customMap', Record.Collection.extend({
    init: function () {
      this.path = 'custom-map'
      this.$map = {subCategory:0, id: 1, name: 2}
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

  it('loads using queries', function (done) {
    record.collections.advanced()
      .query({name: 'bar'})
      .fetch()
      .then(function (collection) {
        expect(collection.get('001')).to.be.an('undefined')
        expect(collection.get('002')).to.be.a(Record.Document)
        expect(collection.get('002').get('name')).to.be('bar')
        done()
      }).catch(done)
  })

  it('limits using queries', function (done) {
    record.collections.advanced()
      .query({$startAtId: '002', $limit: 2})
      .fetch()
      .then(function (collection) {
        expect(collection.get('001')).to.be.an('undefined')
        expect(collection.get('002')).to.be.a(Record.Document)
        expect(collection.get('003')).to.be.a(Record.Document)
        done()
      }).catch(done)
  })

  it('uses custom maps', function (done) {
    record.collections.customMap()
      .query({subCategory: 'foo'})
      .fetch()
      .then(function (collection) {
        expect(collection.documents.length).to.equal(2)
        expect(collection.get('001').get('subCategory')).to.equal('foo')
        expect(collection.get('002').get('subCategory')).to.equal('foo')
        done()
      }).catch(done)
  })

})
