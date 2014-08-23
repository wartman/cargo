var Project = require('../../models').Project;

module.exports = function (knex) {
  knex.schema.createTable('rabbit_project', function (table) {
    table.increments('id').primary();
    table.integer('uuid').notNull();
    table.string('title').notNull();
    table.string('slug').notNull();
    table.string('attachment').nullable();
    table.text('description').nullable();
    table.integer('rabbit_collection_id').unsigned().references('rabbit_collection.id');
    table.dateTime('created').notNull();
    table.dateTime('updated').nullable();
  }).then(function () {
    console.log('rabbit_project created!');
    new Project({
      title: 'Foo',
      slug: 'foo',
    }).save();
    new Project({
      title: 'Bar',
      slug: 'bar'
    });
  }, function (e) {
    console.log(e);
  });
};