modus.config({
  root: '/lib',
  main: 'main',
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

mod('main', function () {
  
  // this.imports('rabbit.application').as('Application');
  this.imports('TestView').from('rabbit.view.testing');

  this.view = new this.TestView({el: '#test'});

});