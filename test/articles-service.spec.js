'use strict';
const knex = require('knex');
const ArticlesService = require('../src/articles_service');

describe('Articles service object', function () {
  let db;
  let testArticles = [
    {
      id: 1,
      date_published: new Date(),
      title: 'Title 1',
      content: 'foo bar baz fake content'
    },
    {
      id: 2,
      date_published: new Date(),
      title: 'Title 2',
      content: 'foo bar baz fake content'
    },
    {
      id: 3,
      date_published: new Date(),
      title: 'Title 3',
      content: 'foo bar baz fake content'
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('articles').truncate());
  afterEach(() => db('articles').truncate());
  after(() => db.destroy());

  context('When Articles table has data', () => {
    beforeEach(() => db('articles').insert(testArticles));

    it('list() fetches all articles from articles table', () => {
      return ArticlesService.list(db)
        .then(result => {
          expect(result).to.eql(testArticles);
        });
    });

    it('findById() returns article by id', () => {
      const article = testArticles[2];
      return ArticlesService.findById(db, article.id)
        .then(result => {
          expect(result).to.eql(article);
        });
    }); 

    it('delete() removes an article', () => {
      const delArticle = testArticles[0];
      return ArticlesService.delete(db, delArticle.id)
        .then(() => {
          return ArticlesService.list(db);
        })
        .then(result => {
          result.forEach(article => {
            expect(article).to.not.eql(delArticle);
          });
        });
    });

    it('update() updates an article with the provide data', () => {
      const newFields = {title: 'Hello World', content: 'Foo bar baz'};
      const article = testArticles[0];
      return ArticlesService.update(db, article.id, newFields)
        .then(result => {
          expect(result.title).to.equal(newFields.title);
          expect(result.content).to.equal(newFields.content);
        });
    });
  });

  context('When Articles table has NO data', () => {
    it('list() returns an empty array', () => {
      return ArticlesService.list(db)
        .then(result => {
          expect(result).to.eql([]);
        });
    });

    it('insert() creates new article in Articles table', () => {
      const article = {
        title: 'Title 4',
        content: 'some great test content'
      };
      return ArticlesService.insert(db, article)
        .then(result => {
          expect(result.title).to.equal(article.title);
          expect(result.content).to.equal(article.content);
        });
    });
  });
  
});