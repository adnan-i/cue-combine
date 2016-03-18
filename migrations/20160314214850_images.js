'use strict';
var tableName = 'images';

exports.up = function(knex, Promise) {
  return knex.schema.createTable(tableName, function(t) {
    t.increments().primary().unsigned();
    t.text('key').notNullable();
    t.text('bucket').notNullable();
    t.json('meta');
    t.json('sizes');
    t.integer('rental_id').notNullable().unsigned().references('id').inTable('rentals').onDelete('CASCADE').onUpdate('CASCADE').index();
    t.timestamp('deleted_at');
    t.timestamp('created_at');
    t.timestamp('updated_at');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(tableName);
};
