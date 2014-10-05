var connect = require('../db/connect').getInstance();
var Project = require('./project').Project;
var Category = require('./category').Category;

// Install a clean database.
// Todo: add checks to see if the database exists,
// some migration stuff.
var install = function () {
  var con = connect.getConnection();
  Project.install(con);
  Category.install(con);
};

module.exports.Project = Project;
module.exports.Category = Category;
module.exports.install = install