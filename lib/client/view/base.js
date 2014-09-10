mod(function (mod) {
  
  mod.imports('View').from('backbone');
  mod.imports('Base').from('..core.base');

  // Extend the Backbone view to use the Base library.
  var BaseView = mod.Base.extend(mod.View);

  mod.View = BaseView.extend({

  }, {

  });

});