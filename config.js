var path = require('path');

// Note: the env that is run depends on the .env file.

var config = {

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
      content: path.join(__dirname, '/content/'),
      media: path.join(__dirname, '/content/media')
    }
  },

  testing: {
    database: {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '/content/data/rabbit-testing.db')
      },
      debug: false
    },
    server: {
      host: 'localhost',
      port: '8080'
    },
    paths: {
      content: path.join(__dirname, '/content/'),
      media: path.join(__dirname, '/content/media')
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
      content: path.join(__dirname, '/content/'),
      media: path.join(__dirname, '/content/media')
    }
  }

};

module.exports = config;