mod(function (mod) {
  
  mod.imports({'View': 'BaseView'}).from('backbone');
  mod.imports('Base').from('..core.base');

  // Extend the Backbone view to use the Base library.
  mod.View = mod.Base.extend({
    constructor: mod.BaseView
  });

  mod.View.mixin(mod.BaseView.prototype);

});