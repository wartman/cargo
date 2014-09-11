mod(function () {
  
  this.imports('both.oop.base').as('Base');
  this.imports('both.oop.mixins.index').as('mixins');

  console.log(this.Base.valueOf());

  // Base
  // ----
  // This file is just here to make importing the
  // 'base' module a bit easier.

});