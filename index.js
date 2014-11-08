require('dotenv').load()
var path = require('path')
var Rabbit = require('./lib/server/rabbit')

Rabbit({

  'host': 'localhost',
  'port': '8080',

	'views': path.join(__dirname, './content/theme/'),
	'cookie secret': '[iH3U{@W%1kN:T*MoTS{|m#m5COT`M*>n~2/F<CN7__(o(uP]>{yo?g#3sU=%_TG',

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
