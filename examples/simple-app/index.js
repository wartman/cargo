var rabbit = require('../../')
var path = require('path')

rabbit.init({
  'module root': __dirname, // Hack to make this folder work: DON'T USE IN YOUR APP
  'record path': 'data',
  'static': 'public'
})

rabbit.set('routes', require('./routes'))

rabbit.run()
