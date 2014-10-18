modus.main({
  root: 'lib/',
  main: 'main',
  dest: '../content/scripts/app.js',
  maps: {
    'underscore': 'client/lib/underscore/underscore',
    'jquery': 'client/lib/jquery/dist/jquery.min',
    'backbone': 'client/lib/backbone/backbone',
    'swig': '../node_modules/swig/dist/swig.min'
  },
  namespaceMaps: {
    'rabbit': 'client'
  }
}, function (_) {
  
  _.imports('BrowseView').from('rabbit.view.admin.browse');

  var browse = new _.BrowseView({el: '#grid'});
  console.log(browse);
  window.browse = browse;

});