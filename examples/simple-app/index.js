var Cargo = require('../../')

Cargo({
  'manifest path': 'data',
  'static path': 'public',
  'models': require('./models'),
  'routes': require('./routes')
}).run()
