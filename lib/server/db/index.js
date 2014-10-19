var _ = require('lodash');
var bookshelf = require('bookshelf');

var connect = require('./connect').getInstance();

// db
// --
// Rabbit's instance of Bookshelf.
var db = bookshelf(connect.getConnection());

// Use the registry plugin, which allows us to avoid 
// circular dependencies.
db.plugin('registry');

// Export module
module.exports = db;
module.exports.connect = connect;
