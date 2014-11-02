var _ = require('lodash')
var bcrypt = require('bcryptjs')
var Promise = require('bluebird')

var db = require('../db')
var errors = require('../errors')

// User
// ----
var User = new db.Model('User', {

  tableName: 'rabbit_users',

  'id': db.field.PrimaryKey(),
  'uuid': db.field.Int(),
  'username': db.field.Txt({nullable: false, unique: true}),
  'firstname': db.field.Txt(),
  'lastname': db.field.Txt(),
  'role': db.field.Txt({nullable: false, defaultTo: 'Reader'}),
  'status': db.field.Txt({nullable: false, defaultTo: 'inactive'}),
  'email': db.field.Email({nullable: false}),
  'password': db.field.Password({nullable: false}),
  'last_login': db.field.DateTime({nullable:true}),
  'created': db.field.DateTime({nullable:false}),
  'updated': db.field.DateTime()

})

User.methods({

  initialize: function () {
    this.on('saving', this.validate, this)
    this.on('saving', this.encryptPassword, this)
  },

  // Encrypt passwords before saving to the DB
  encryptPassword: function () {
    var pass = this.get('password')
    if (pass) {
      // ?? Should salt be done elsewhere??
      var salt = bcrypt.genSaltSync(10)
      var hashedPass = bcrypt.hashSync(pass, salt)
      this.set('password', hashedPass)
    }
  },

  // Temp admin check.
  // Should be configurable.
  isAdmin: function () {
    var role = this.get('role')
    return role === 'Administrator' 
  },

  isAuthed: function () {
    // ???
    return this.get('status') === 'active'
  },

  roles: function () {
    return this.belongsToMany('Role')
  },

  // Check if the current user has permission to do an action. 'Permissions'
  // should be an object that contains a list of roles and what they allow a user
  // to do.
  // @todo
  // This will require a lot of work: for now, we'll just check if a user is logged in.
  // can: function (action, context, permissions) {
  //   var self = this
  //   if (action === 'edit') {

  //   }
  // }

})

User.staticMethods({

  // Authenticate a user with a username and a password.
  authenticate: function (username, password) {
    var self = this
    return this.forge({username: username}).fetch().then(function (user) {
      if (!user) {
        return Promise.reject(new errors.NotFoundError('Incorrect password or username'))
      }
      if (user.get('status') !== 'locked') {
        var matched = bcrypt.compareSync(password, user.get('password'))
        if (!matched) {
          // @todo
          // Implement a system to limit the number of times a user can attempt to log in
          // before they're locked out.
          return Promise.reject(new errors.NotAuthorizedError('Incorrect password or username'))
        }
      }
      user.set({
        status: 'active',
        last_login: new Date()
      })
      return user.save().catch(function (err) {
        // If we get a validation or other error during this save, catch it and log it, but don't
        // cause a login error because of it. The user validation is not important here.
        Logger.logError(
          err.message,
          'Error thrown from user update during login',
          'Check your profile for errors after logging in.'
        )
        return user
      })
    })
  }

})

User.register()
