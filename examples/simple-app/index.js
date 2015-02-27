var Cargo = require('../../')

Cargo({
  'module root': __dirname, // Hack to make this folder work: DON'T USE IN YOUR APP
  'manifest path': 'data',
  'static path': 'public',
  'models': require('./models'),
  'routes': require('./routes')
}).run()
