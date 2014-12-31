var rabbit = require('../../../../')
var fields = rabbit.db.fields

// A test model
var Test = new rabbit.db.Model('Test', {
  'id': fields.primaryKey(),
  'name': fields.string({nullable: false}),
  'content': fields.text(),
  'number': fields.integer(),
  'created': fields.dateTime({nullable:false}),
  'updated': fields.dateTime()
})

Test.addMethods({
  sayFoo: function () {
    return 'foo'
  }
})

Test.register()
