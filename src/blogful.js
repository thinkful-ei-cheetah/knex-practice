'use strict';
require('dotenv').config();
const ArticlesService = require('./articles_service');
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log(ArticlesService.getAllArticles());