var Category = require('../../models').Category;

module.exports = function (knex) {
  knex.schema.createTable('rabbit_category', function (table) {
    table.increments('id').primary();
    table.integer('uuid').notNull();
    table.string('name', 100).notNull();
    table.text('description').nullable();
    table.dateTime('created').notNull();
    table.dateTime('updated').nullable();
  }).then(function () {
    console.log('rabbit_collection created!');
    new Category({
      name: 'default',
      description: 'The default collection'
    }).save();
  }, function (e) {
    console.log(e);
  });
};