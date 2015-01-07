var rabbit = require('../../../../')
var fields = rabbit.db.fields

// A test model
rabbit.db.Schema('Test', {
  'id': fields.primaryKey(),
  'name': fields.string({nullable: false}),
  'content': fields.text(),
  'number': fields.integer(),
  'created': fields.dateTime({nullable:false}),
  'updated': fields.dateTime()

  methods: {
    sayFoo: function () {
      return 'foo'
    }
  }
  
})

Test.register()
