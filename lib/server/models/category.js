var model = require('./base');

// Category
// --------
var Category = model.Model.extend({

  tableName: 'rabbit_categories',

  schema: function () {
    return {
      'id': model.PrimaryKey(),
      'uuid': model.Int({nullable: false}),
      'name': model.Str({maxlength: 100, nullable: false}),
      'slug': model.Slug({maxlength: 100, nullable: false}),
      'description': model.Txt(),
      'created': model.DateTime({nullable: false}),
      'updated': model.DateTime()
    };
  },

  projects: function () {
    return this.hasMany('Project', 'category_id');
  }

});

Categories = model.Collection.extend({
  model: Category
});

module.exports.Category = model.model('Category', Category);
module.exports.Categories = model.collection('Categories', Categories);
