var Rabbit = require('./lib/server/rabbit');

new Rabbit({
  baseDir: __dirname + '/',
  themesDir: 'content/theme',
}).run();