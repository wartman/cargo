var db = require('../db')

// Setting
// -------
var Setting = new db.Model('Setting', {

  tableName: 'rabbit_settings',

  'id': db.field.PrimaryKey(),
  'uuid': db.field.Int(),
  'key': db.field.Txt({nullable: false}),
  'value': db.field.Txt({nullable: false}),
  'created': db.field.DateTime({nullable:false}),
  'updated': db.field.DateTime()

})

Setting.register()
