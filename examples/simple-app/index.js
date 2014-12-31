var rabbit = require('../../')

rabbit.init({

  'database': {
    production: {
      client: 'sqlite3',
      connection: {
        filename: './content/database.db'
      },
      debug: false
    }
  },
  'updates': './updates'
  'static': './content'

})

rabbit.imports('./models')

rabbit.set('routes', require('./routes'))

rabbit.run()
