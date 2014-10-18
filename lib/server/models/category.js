var db = require('../db');
var field = require('../db/field');

// Category
// --------
var Category = db.Model.extend({

  tableName: 'rabbit_categories',

  schema: function () {
    return {
      'id': field.PrimaryKey(),
      'uuid': field.Int({nullable: false}),
      'name': field.Str({maxlength: 100, nullable: false}),
      'slug': field.Slug({maxlength: 100, nullable: false}),
      'description': field.Txt(),
      'created': field.DateTime({nullable: false}),
      'updated': field.DateTime()
    };
  },

  projects: function () {
    return this.hasMany('Project', 'category_id');
  }

});

Categories = db.Collection.extend({
  model: Category
});

module.exports.Category = Category;
module.exports.Categories = Categories;
