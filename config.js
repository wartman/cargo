var path = require('path');

var config = {

  // Uncomment depending on which state you
  // want active.
  env: 'development',
  // env: 'production',

  migrations: 'content/data/migrations',

  development: {
    database: {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '/content/data/rabbit-dev.db')
      },
      debug: false
    },
    server: {
      host: 'localhost',
      port: '8080'
    },
    paths: {
      content: path.join(__dirname, '/content/')
    }
  },

  production: {
    database: {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '/content/data/rabbit.db')
      },
      debug: false
    },
    server: {
      host: '127.0.0.1',
      port: '2368'
    },
    paths: {
      content: path.join(__dirname, '/content/')
    }
  }

};

module.exports = config;