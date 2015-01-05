var Promise = require('bluebird')

module.exports = function (db, next, error) {
  // User used in testing
  var user = db.model('User', {
    'username': 'admin',
    'firstname': 'Admin',
    'lastname': 'User',
    'role': 'Admin',
    'status': 'active',
    'email': 'tester@fake-email.org',
    'password': 'admin',
  })

  var post = db.model('Post', {
    'title': 'Hello World',
    'content': 'this is the first post!'
  })

  Promise.all([
    user.save(),
    post.save()
  ]).then(next)
    .catch(error)
}