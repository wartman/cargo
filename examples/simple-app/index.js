var rabbit = require('../../')
var path = require('path')

rabbit.init({
  'db connection': {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, './content/database.db')
    },
    debug: false
  },
  'db updates': path.join(__dirname, './updates'),
  'static': path.join(__dirname, './content')
})

rabbit.imports('./examples/simple-app/models')

rabbit.set('routes', require('./routes'))

rabbit.run()
