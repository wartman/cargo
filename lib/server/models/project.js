var db = require('../db')

// Project
// -------
// Holds a single project, including attachments, etc.
var Project = new db.Model('Project', {

  tableName: 'rabbit_projects',

  'id': db.field.PrimaryKey(),
  'uuid': db.field.Int({nullable: false}),
  'title': db.field.Str({maxlength: 100, nullable: false}),
  'slug': db.field.Slug({maxlength: 100, nullable: false}),
  'attachment': db.field.Url(),
  'description': db.field.Txt(),
  'category_id': db.field.Int({references: 'rabbit_category.id'}),
  'created': db.field.DateTime({nullable:false}),
  'updated': db.field.DateTime()

})

Project.methods({

  category: function () {
    return this.belongsTo('Category', 'category_id')
  }

})

Project.register()
