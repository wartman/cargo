var Cargo = require('../../')

Cargo({

  'manifest path': 'data',
  'static path': 'public',

  // The following will be auto-loaded and registered on `run`.
  'models': 'models',
  'routes': 'routes'
  
}).run()
