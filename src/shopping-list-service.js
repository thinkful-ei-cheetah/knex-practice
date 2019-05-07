'use strict';

const ShoppingListService = {
  list(knex) {
    return knex('shopping_list').select('*');
  },

  findById(knex, id) {
    return knex('shopping_list').where({id}).first('*');
  },

  update(knex, id, fields) {
    return knex('shopping_list')
      .where({id})
      .update(fields)
      .returning('*')
      .then(rows => rows[0]);
  },

  delete(knex, id) {
    return knex('shopping_list').where({id}).delete();
  },

  insert(knex, item) {
    return knex('shopping_list').insert(item);
  }
};

module.exports = ShoppingListService;