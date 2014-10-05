var bcrypt = require('bcrypt');

var db = require('../db');
var field = require('../db/field');

// User
// ----
var User = db.Model.extend({

  schema: function () {
    return {
      'id': field.PrimaryKey(),
      'uuid': field.Int(),
      'username': field.Txt({nullable: false, unique: true}),
      'firstname': field.Txt(),
      'lastname': field.Txt(),
      'email': field.Email({nullable: false}),
      'password': field.Password({nullable: false})
    }
  },

  initialize: function () {
    this.sup();
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
  }

});