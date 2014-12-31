var Promise = require('bluebird')

module.exports = function (db, next) {
  var test = db.model('Test', {
    'name': 'foo',
    'content': 'bar',
    'number': '1'
  })
  test.save().then(next)
}
