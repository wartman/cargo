var Model = require('./base').Model;

// Category
// --------
var Category = Model.extend({

  tableName: 'rabbit_category',

  projects: function () {
    return this.hasMany(Project);
  }

});

// Project
// -------
// The table that holds project data.
var Project = Model.extend({

  tableName: 'rabbit_project',

  category: function () {
    return this.belongsTo(Category);
  }

});

module.exports = {
  Project: Project,
  Category: Category,
  // User: User
};