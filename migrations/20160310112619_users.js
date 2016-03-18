'use strict';
var tableName = 'users';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(tableName, function(t) {
    t.increments().primary().unsigned();
    t.text('first_name').notNullable();
    t.text('last_name').notNullable();
    t.text('email').notNullable().unique();
    t.text('password').notNullable();
    t.text('salt').notNullable();
    t.timestamp('deleted_at');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(tableName);
};
