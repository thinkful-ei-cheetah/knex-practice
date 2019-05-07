'use strict';
require('dotenv').config();
const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service');

describe('ShoppingListService', () => {
  let db;
  const testItems = [
    {
      id: 1,
      name: 'Item 1',
      price: '1.99',
      category: 'Snack',
      checked: false,
      date_added: new Date()
    },
    {
      id: 2,
      name: 'Item 2',
      price: '2.99',
      category: 'Breakfast',
      checked: false,
      date_added: new Date()
    },
    {
      id: 3,
      name: 'Item 3',
      price: '3.99',
      category: 'Lunch',
      checked: false,
      date_added: new Date()
    },
    {
      id: 4,
      name: 'Item 4',
      price: '4.99',
      category: 'Main',
      checked: false,
      date_added: new Date()
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate());
  beforeEach(() => db('shopping_list').insert(testItems));
  afterEach(() => db('shopping_list').truncate());
  after(() => db.destroy());

  it('list() returns all items in shopping-list table', async () => {
    const results = await ShoppingListService.list(db);
    expect(results).to.eql(testItems);
  });

  it('findById() returns an item by id', async () => {
    const expected = testItems[0];
    const result = await ShoppingListService.findById(db, expected.id);
    expect(result).to.eql(expected);
  });

  it('update() updates an item with passed in fields', async () => {
    const fields = {price: '9.99'};
    const expected = testItems[0];
    await ShoppingListService.update(db, expected.id, fields);
    const result = await ShoppingListService.findById(db, expected.id);
    expect(result.price).to.equal(fields.price);
  });

  it('delete() deletes an item by id', async () => {
    const deleted = testItems[0];
    await ShoppingListService.delete(db, deleted.id);
    const result = await ShoppingListService.findById(db, deleted.id);
    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.undefined;
  });

  it('insert() creates new items', async () => {
    const newItem = {
      id: 5,
      name: 'Item 5',
      price: '5.99',
      category: 'Main',
      checked: false,
      date_added: new Date()
    };
    await ShoppingListService.insert(db,newItem);
    const items = await ShoppingListService.list(db);
    expect(items).to.deep.include(newItem);
  });

});