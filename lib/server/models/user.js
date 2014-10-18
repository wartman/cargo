var bcrypt = require('bcryptjs');

var db = require('../db');
var field = require('../db/field');

// User
// ----
var User = db.Model.extend({

  tableName: 'rabbit_users',

  schema: function () {
    return {
      'id': field.PrimaryKey(),
      'uuid': field.Int(),
      'username': field.Txt({nullable: false, unique: true}),
      'firstname': field.Txt(),
      'lastname': field.Txt(),
      'role': field.Txt({nullable: false, defaultTo: 'Reader'}),
      'email': field.Email({nullable: false}),
      'password': field.Password({nullable: false}),
      'created': field.DateTime({nullable:false}),
      'updated': field.DateTime()
    }
  },

  initialize: function () {
    db.Model.prototype.initialize.apply(this, arguments);
    this.on('saving', this.encryptPassword, this);
  },

  // Encrypt passwords before saving to the DB
  encryptPassword: function () {
    var pass = this.get('password');
    if (pass) {
      // ?? Should salt be done elsewhere??
      var salt = bcrypt.genSaltSync(10);
      var hashedPass = bcrypt.hashSync(pass, salt);
      this.set('password', hashedPass);
    }
  },

  // Temp admin check.
  // Should be configurable.
  isAdmin: function () {
    var role = this.get('role');
    return role === 'Administrator'; 
  }

});

var Users = db.Collection.extend({
  model: User
});

module.exports.User = User;
module.exports.Users = Users;
