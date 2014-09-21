modus.main({
  root: 'scripts/',
  main: 'main',
  dest: '../content/scripts/app.js',
  maps: {
    'underscore': 'client/lib/underscore/underscore',
    'jquery': 'client/lib/jquery/dist/jquery.min',
    'backbone': 'client/lib/backbone/backbone',
    'swig': 'client/lib/swig/dist/swig.min'
  },
  namespaceMaps: {
    'rabbit': 'client'
  }
}, function () {
  
  // this.imports('rabbit.application').as('Application');
  this.imports('TestView').from('rabbit.view.testView');

  this.view = new this.TestView({el: '#test'});
  this.view.test();

});