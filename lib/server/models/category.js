var db = require('../db')

// Category
// --------
var Category = new db.Model('Category', {

  tableName: 'rabbit_categories',

  'id': db.field.PrimaryKey(),
  'uuid': db.field.Int({nullable: false}),
  'name': db.field.Str({maxlength: 100, nullable: false}),
  'slug': db.field.Slug({maxlength: 100, nullable: false}),
  'description': db.field.Txt(),
  'created': db.field.DateTime({nullable: false}),
  'updated': db.field.DateTime()

})

Category.methods({

  projects: function () {
    return this.hasMany('Project', 'category_id')
  }

})

Category.register()
