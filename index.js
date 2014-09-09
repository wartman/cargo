var Rabbit = require('./lib/server/rabbit');

Rabbit({
  baseDir: __dirname + '/',
  themesDir: 'content/theme',
}).run();