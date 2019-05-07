'use strict';
const ArticlesService = {
  list(knex) {
    return knex('articles').select('*');
  },

  insert(knex, article) {
    return knex('articles')
      .insert(article)
      .returning('*')
      .then(rows => rows[0]);
  },

  findById(knex, id) {
    return knex('articles').select('*').where('id', id).first();
  },

  delete(knex, id) {
    return knex('articles')
      .where('id', id)
      .delete();
  },

  update(knex, id, fields) {
    return knex('articles')
      .where('id', id)
      .update(fields)
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = ArticlesService;