var db = require('../db');
var field = require('../db/field');

// Role
// ----
var Role = db.Model.extend({

  tableName: 'rabbit_role',

  schema: function () {
    return {
      'id': field.PrimaryKey(),
      'uuid': field.Int(),
      'name': field.Txt({nullable: false}),
      'description': field.Txt({nullable: false}),
      'created': field.DateTime({nullable:false}),
      'updated': field.DateTime()
    }
  }

});

var Roles = db.Collection.extend({
  model: Role
});

module.exports.Role = Role;
module.exports.Roles = Roles;
