var db = require('../db')

// Role
// ----
var Role = new db.Model('Role', {

  tableName: 'rabbit_role',

  'id': db.field.PrimaryKey(),
  'uuid': db.field.Int(),
  'name': db.field.Txt({nullable: false}),
  'description': db.field.Txt({nullable: false}),
  'created': db.field.DateTime({nullable:false}),
  'updated': db.field.DateTime()

})

Role.methods({

  users: function () {
    // NOTE:
    // This currently does not work. Look into adding 
    // relationship tables to your field system somehow.
    return this.belongsToMany('User')
  }

})

Role.register()
