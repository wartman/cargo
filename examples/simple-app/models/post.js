var rabbit = require('../../../')
var fields = rabbit.db.fields

rabbit.db.Schema.add('Post', {
  'id': fields.primaryKey(),
  'title': fields.string({nullable: false}),
  'content': fields.text(),
  'created': fields.dateTime({nullable:false}),
  'updated': fields.dateTime()
})
