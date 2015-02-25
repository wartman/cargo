var Rabbit = require('../../')

Rabbit({
  'module root': __dirname, // Hack to make this folder work: DON'T USE IN YOUR APP
  'record path': 'data',
  'static path': 'public',
  'models': require('./models'),
  'routes': require('./routes')
}).run()
