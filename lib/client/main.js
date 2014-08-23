modus.config({
  root: 'lib',
  main: 'rabbit.main',
  dest: '../content/scripts/app.js',
  maps: {
    'underscore': 'lib/underscore/underscore-min',
    'jquery': 'lib/jquery/dist/jquery.min',
    'backbone': 'lib/backbone/backbone-min'
  },
  namespaceMaps: {
    'rabbit': 'client'
  }
});

mod('rabbit.main', function () {
  
  this.imports('.application').as('Application');

});