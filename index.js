require('dotenv').load()
var path = require('path')
var Rabbit = require('./lib/server/rabbit')

Rabbit({

  'host': 'localhost',
  'port': '8080',

	'views': path.join(__dirname, './content/theme/'),

	'database': {
		development: {
	    client: 'sqlite3',
	    connection: {
	      filename: path.join(__dirname, '/content/data/rabbit-dev.db')
	    },
	    debug: false
	  },
	  production: {
	    client: 'sqlite3',
	    connection: {
	      filename: path.join(__dirname, '/content/data/rabbit.db')
	    },
	    debug: false
	  }
  }

}).run()
