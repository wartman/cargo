module(function (_) {
  
  _.imports({'View': 'BaseView'}).from('backbone');
  _.imports('Base').from('..core.base');

  // Extend the Backbone view to use the Base library.
  _.View = _.Base.extend({
    constructor: _.BaseView
  });

  _.View.mixin(_.BaseView.prototype);

});