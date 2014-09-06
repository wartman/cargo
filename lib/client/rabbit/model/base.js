mod(function () {
  
  this.imports('Model', 'Controller', 'sync').from('backbone');
  this.imports('Base').from('..core.base');

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