mod(function () {
  
  this.imports('Model', 'Controller', 'sync').from('backbone');
  this.imports('both.util.base').as('Base');

  var Model = this.Model = this.Base.extend(this.Model).implement({
    // instance
  }, {
    // statics
  });

  var Controller = this.Controller = this.Base.extend(this.Controller).implement({
  
    model: Model

  }, {
    // statics
  });

});