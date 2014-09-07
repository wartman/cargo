mod(function () {
  
  this.imports('Model', 'Controller', 'sync').from('backbone');
  this.imports('Base').from('..core.base');

  var Model = this.Model = this.Base.extend(this.Model).implement({

    parse: function (data) {
      return data.data[0];
    }

  }, {
    // statics
  });

  var Controller = this.Controller = this.Base.extend(this.Controller).implement({
  
    model: Model,

    parse: function (data) {
      return data.data;
    }

  }, {
    // statics
  });

});