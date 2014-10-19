var model = require('./base');

// Project
// -------
// Holds a single project, including attachments, etc.
var Project = model.Model.extend({

  tableName: 'rabbit_projects',

  schema: function () {
    return {
      'id': model.PrimaryKey(),
      'uuid': model.Int({nullable: false}),
      'title': model.Str({maxlength: 100, nullable: false}),
      'slug': model.Slug({maxlength: 100, nullable: false}),
      'attachment': model.Url(),
      'description': model.Txt(),
      'category_id': model.Int({references: 'rabbit_category.id'}),
      'created': model.DateTime({nullable:false}),
      'updated': model.DateTime()
    }
  },

  category: function () {
    return this.belongsTo('Category', 'category_id');
  }

});

var Projects = model.Collection.extend({
  model: Project
});

module.exports.Project = model.model('Project', Project);
module.exports.Projects = model.collection('Projects', Projects);
