var db = require('../db');
var field = require('../db/field')

// Project
// -------
// Holds a single project, including attachments, etc.
var Project = db.Model.extend({

  tableName: 'rabbit_project',

  schema: function () {
    return {
      'id': field.PrimaryKey(),
      'uuid': field.Int({nullable: false}),
      'title': field.Str({maxlength: 100, nullable: false}),
      'slug': field.Slug({maxlength: 100, nullable: false}),
      'attachment': field.Url(),
      'description': field.Txt(),
      'category_id': field.Int({references: 'rabbit_category.id'}),
      'created': field.DateTime({nullable:false}),
      'updated': field.DateTime()
    }
  },

  category: function () {
    return this.belongsTo('Category', 'category_id');
  }

});

var Projects = db.Collection.extend({
  model: Project
});

module.exports = {
  Project: db.model('Project', Project),
  Projects: db.collection('Projects', Projects)
};