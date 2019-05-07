'use strict';
require('dotenv').config();

const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});


const searchByProductName = (searchTerm) => {
  knexInstance('amazong_products')
    .select('*')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => console.log(res));
};
// searchByProductName('holo');
  
const paginateProducts = (page) => {
  const limit = 10;
  const offset = limit * (page - 1);
  knexInstance('amazong_products')
    .select('product_id', 'name', 'price', 'category')
    .limit(limit)
    .offset(offset)
    .then(res => console.log(res));
};
// paginateProducts(2);

const getProductsWithImages = () => {
  knexInstance('amazong_products')
    .select('product_id', 'name', 'price', 'category', 'image')
    .whereNotNull('image')
    .then(res => console.log(res));
};
// getProductsWithImages();

function mostPopularVideoForDays(days) {
  knexInstance('whopipe_video_views')
    .select('video_name', 'region')
    .count('date_viewed AS views')
    // eslint-disable-next-line quotes
    .where('date_viewed', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, days)) 
    .groupBy('video_name', 'region')
    .orderBy('region', 'ASC')
    .orderBy('views', 'DESC')
    .then(res => console.log(res));
}
// mostPopularVideoForDays(30);

function findItemByName(searchText){
  knexInstance('shopping_list')
    .select('*')
    .where('name', 'ILIKE', `%${searchText}%`)
    .then(res => console.log(res));
}
// findItemByName('ham');

function getAllItems(page){
  if (page < 1) return 'page must be greater than 0';
  const limit = 6;
  const offset = limit * (page - 1);
  knexInstance('shopping_list')
    .select('*')
    .limit(limit)
    .offset(offset)
    .then(res => console.log(res));
}
// getAllItems(2);

function getItemsAfterDate(daysAgo){
  knexInstance('shopping_list')
    .select('*')
    // eslint-disable-next-line quotes
    .where('date_added', '<', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .orderBy('date_added', 'DESC')
    .then(res => console.log(res));
}
// getItemsAfterDate(5);

function sumItemCategories(){
  knexInstance('shopping_list')
    .select('category')
    .count('name AS items')
    .sum('price AS total')
    .select(knexInstance.raw('ROUND(AVG(price), 2) AS average'))
    .groupBy('category')
    .then(res => console.log(res));
}
// sumItemCategories();