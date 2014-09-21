modus.main({
  root: 'scripts/',
  main: 'main',
  dest: '../content/scripts/app.js',
  maps: {
    'underscore': 'client/lib/underscore/underscore',
    'jquery': 'client/lib/jquery/dist/jquery.min',
    'backbone': 'client/lib/backbone/backbone',
    'swig': '../node/swig/dist/swig.min'
  },
  namespaceMaps: {
    'rabbit': 'client'
  }
}, function () {
  
  this.imports('BrowseView').from('rabbit.view.admin.browse');

  var browse = new this.BrowseView({el: '#grid'});
  window.browse = browse;

});