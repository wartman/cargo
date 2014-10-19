var model = require('./base');

// Role
// ----
var Role = model.Model.extend({

  tableName: 'rabbit_role',

  schema: function () {
    return {
      'id': model.PrimaryKey(),
      'uuid': model.Int(),
      'name': model.Txt({nullable: false}),
      'description': model.Txt({nullable: false}),
      'created': model.DateTime({nullable:false}),
      'updated': model.DateTime()
    }
  },

  users: function () {
    // NOTE:
    // This currently does not work. Look into adding 
    // relationship tables to your field system somehow.
    return this.belongsToMany('User');
  }

});

var Roles = model.Collection.extend({
  model: Role
});

module.exports.Role = model.model('Role', Role);
module.exports.Roles = model.collection('Roles', Roles);
