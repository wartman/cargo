modus.main({
  root: 'scripts/',
  main: 'main',
  maps: {
    'underscore': 'client/lib/underscore/underscore',
    'jquery': 'client/lib/jquery/dist/jquery.min',
    'backbone': 'client/lib/backbone/backbone',
    'swig': '../node/swig/dist/swig.min'
  },
  namespaceMaps: {
    'rabbit': 'client',
    'test': 'client.test'
  }
}, function () {

  this.imports('test.template.base').as('templateTest');
  this.imports('test.model.project').as('projectTest');

  // Setup.
  mocha.setup('bdd');
    
  // Run all tests
  this.templateTest.run();
  this.projectTest.run();

  // Run mocha.
  mocha.run();

});