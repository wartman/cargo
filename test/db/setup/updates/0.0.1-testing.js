var Promise = require('bluebird')

module.exports = function (db, next, error) {

  var test = db.model('Test', {
    'name': 'update',
    'content': 'updated',
    'number': '1'
  })

  // User used in testing
  var user = db.model('User', {
    'username': 'tester',
    'firstname': 'Testy',
    'lastname': 'Tester',
    'role': 'Reader',
    'status': 'active',
    'email': 'tester@fake-email.org',
    'password': 'test',
  })

  Promise.all([
    test.save(),
    user.save()
  ]).then(next)
    .catch(error)

}
