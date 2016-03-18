'use strict';
var tableName = 'rentals';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(tableName, function(t) {
    t.increments().primary().unsigned();
    t.text('name').notNullable();
    t.enu('type', ['apartment', 'house']).notNullable();
    t.integer('owner_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').index();
    t.timestamp('deleted_at');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(tableName);
};
