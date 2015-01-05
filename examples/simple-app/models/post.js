var rabbit = require('../../../')
var fields = rabbit.db.fields

var Post = new rabbit.db.Schema('Post', {
  'id': fields.primaryKey(),
  'title': fields.string({nullable: false}),
  'content': fields.text(),
  'created': fields.dateTime({nullable:false}),
  'updated': fields.dateTime()
})

Post.register()
