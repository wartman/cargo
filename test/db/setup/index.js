var path = require('path')
var fs = require('fs')
var rabbit = require('../../../')

var _complete = null

// Helpers to setup the test database
function connectToDb () {
  var db = rabbit.getDb()
  var testingDb =  path.join(__dirname, './temp/rabbit-testing.db')

  if (_complete) return _complete

  // Remove an existing db
  if (fs.existsSync(testingDb)) fs.unlinkSync(testingDb)

  db.set('db connection', {
    client: 'sqlite3',
    connection: {
      filename: testingDb
    },
    debug: false
  })
  db.set('db updates', path.join(__dirname, './updates'))

  // Import test models
  var imports = rabbit.util.createImporter(__dirname)
  imports('./models')

  // Exports a promise
  _complete = db.connect()
  return _complete
}

exports.connectToDb = connectToDb
