mod(function () {
  
  this.imports('View').from('backbone');
  this.imports('Base').from('..core.base');

  // Extend the Backbone view to use the Base library.
  var BaseView = this.Base.extend(this.View);

  this.View = BaseView.extend({

  }, {

  });

});