const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const {makeProductsArray} = require ('./products.fixtures')

const { makeUsersArray } = require('./users.fixtures')



describe('African Clothing Endpoints', function() {
  let db
  

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL ,
    })
    app.set('db', db)

  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE users, user_products, products RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE users, user_products, products RESTART IDENTITY CASCADE'))

  describe(`GET /api/products`, () => {
    context(`Given no products`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/products')
          .expect(200, [])
      })
    })

    context('Given there are products in the database', () => {
      const testUsers = makeUsersArray();
      const testProducts = makeProductsArray();

      beforeEach('insert products', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('products')
              .insert(testProducts)
          })
      })

      it('responds with 200 and all of the products', () => {
        return supertest(app)
          .get('/api/products')
          .expect(200, testProducts)
      })
    })

     context('Given there are products in the database', () => {
      const testUsers = makeUsersArray();
      const testProducts = makeProductsArray();

      beforeEach('insert products', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('products')
              .insert(testProducts)
          })
      })

      it('responds with 200 and all of the products', () => {
        return supertest(app)
          .get('/api/products')
          .expect(200, testProducts)
      })
    })

    // context(`Given an XSS attack product`, () => {
    //   const testUsers = makeUsersArray();
    //   const { maliciousArticle, expectedArticle } = makeMaliciousArticle()

    //   beforeEach('insert malicious article', () => {
    //     return db
    //       .into('blogful_users')
    //       .insert(testUsers)
    //       .then(() => {
    //         return db
    //           .into('blogful_articles')
    //           .insert([ maliciousArticle ])
    //       })
    //   })

    //   it('removes XSS attack content', () => {
    //     return supertest(app)
    //       .get(`/api/articles`)
    //       .expect(200)
    //       .expect(res => {
    //         expect(res.body[0].title).to.eql(expectedArticle.title)
    //         expect(res.body[0].content).to.eql(expectedArticle.content)
    //       })
    //   })
    // })
  })

  describe(`GET /api/products/:product_id`, () => {
    context(`Given no product`, () => {
      it(`responds with 404`, () => {
        const productId = 123456
        return supertest(app)
          .get(`/api/products/${productId}`)
          .expect(404, { error: { message: `Product doesn't exist` } })
      })
    })

    context('Given there are product in the database', () => {
      const testUsers = makeUsersArray();
      const testProducts = makeProductsArray()

      beforeEach('insert products', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('products')
              .insert(testProducts)
          })
      })

      it('responds with 200 and the specified product', () => {
        const productId = 2
        const expectedProduct = testProducts[productId - 1]
        return supertest(app)
          .get(`/api/products/${productId}`)
          .expect(200, expectedProduct)
      })
    })

    // context(`Given an XSS attack article`, () => {
    //   const testUsers = makeUsersArray();
    //   const { maliciousArticle, expectedArticle } = makeMaliciousArticle()

    //   beforeEach('insert malicious article', () => {
    //     return db
    //       .into('blogful_users')
    //       .insert(testUsers)
    //       .then(() => {
    //         return db
    //           .into('blogful_articles')
    //           .insert([ maliciousArticle ])
    //       })
    //   })

    //   it('removes XSS attack content', () => {
    //     return supertest(app)
    //       .get(`/api/articles/${maliciousArticle.id}`)
    //       .expect(200)
    //       .expect(res => {
    //         expect(res.body.title).to.eql(expectedArticle.title)
    //         expect(res.body.content).to.eql(expectedArticle.content)
    //       })
    //   })
    // })
  })

  // describe(`POST /api/products`, () => {
  //   const testUsers = makeUsersArray();
  //   beforeEach('insert malicious product', () => {
  //     return db
  //       .into('users')
  //       .insert(testUsers)
  //   })

  //   it(`creates a product, responding with 201 and the new product`, () => {
  //     const newProduct = {
  //       name: 'Skirt',
  //       brand: 'Ankara',
        
  //     }
  //     return supertest(app)
  //       .post('/api/products')
  //       .send(newProduct)
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body.name).to.eql(newProduct.name)
  //         expect(res.body.brand).to.eql(newProductbrand)
  //         expect(res.body).to.have.property('id')
  //         expect(res.headers.location).to.eql(`/api/products/${res.body.id}`)
  //         const expected = new Intl.DateTimeFormat('en-US').format(new Date())
  //         const actual = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_published))
  //         expect(actual).to.eql(expected)
  //       })
  //       .then(res =>
  //         supertest(app)
  //           .get(`/api/products/${res.body.id}`)
  //           .expect(res.body)
  //       )
  //   })

  //   const requiredFields = ['name', 'brand']

  //   requiredFields.forEach(field => {
  //     const newProduct = {
  //       name: 'Test new product',
  //       brand: 'Ankara',
       
  //     }

  //     it(`responds with 400 and an error message when the '${field}' is missing`, () => {
  //       delete newProduct[field]

  //       return supertest(app)
  //         .post('/api/products')
  //         .send(newProduct)
  //         .expect(400, {
  //           error: { message: `Missing '${field}' in request body` }
  //         })
  //     })
  //   })

  //   // it('removes XSS attack content from response', () => {
  //   //   const { maliciousArticle, expectedArticle } = makeMaliciousArticle()
  //   //   return supertest(app)
  //   //     .post(`/api/articles`)
  //   //     .send(maliciousArticle)
  //   //     .expect(201)
  //   //     .expect(res => {
  //   //       expect(res.body.title).to.eql(expectedArticle.title)
  //   //       expect(res.body.content).to.eql(expectedArticle.content)
  //   //     })
  //   // })
  // })

  // describe(`DELETE /api/products/:products_id`, () => {
  //   context(`Given no products`, () => {
  //     it(`responds with 404`, () => {
  //       const productId = 123456
  //       return supertest(app)
  //         .delete(`/api/products/${productId}`)
  //         .expect(404, { error: { message: `Product doesn't exist` } })
  //     })
  //   })

  //   context('Given there are products in the database', () => {
  //     const testUsers = makeUsersArray();
  //     const testProducts = makeProductsArray()

  //     beforeEach('insert products', () => {
  //       return db
  //         .into('busers')
  //         .insert(testUsers)
  //         .then(() => {
  //           return db
  //             .into('products')
  //             .insert(testProducts)
  //         })
  //     })

  //     it('responds with 204 and removes the product', () => {
  //       const idToRemove = 2
  //       const expectedProducts = testProducts.filter(product => product.id !== idToRemove)
  //       return supertest(app)
  //         .delete(`/api/products/${idToRemove}`)
  //         .expect(204)
  //         .then(res =>
  //           supertest(app)
  //             .get(`/api/product`)
  //             .expect(expectedProducts)
  //         )
  //     })
  //   })
  // })

  // describe(`PATCH /api/articles/:article_id`, () => {
  //   context(`Given no articles`, () => {
  //     it(`responds with 404`, () => {
  //       const articleId = 123456
  //       return supertest(app)
  //         .delete(`/api/articles/${articleId}`)
  //         .expect(404, { error: { message: `Article doesn't exist` } })
  //     })
  //   })

  //   context('Given there are articles in the database', () => {
  //     const testUsers = makeUsersArray();
  //     const testArticles = makeArticlesArray()

  //     beforeEach('insert articles', () => {
  //       return db
  //         .into('blogful_users')
  //         .insert(testUsers)
  //         .then(() => {
  //           return db
  //             .into('blogful_articles')
  //             .insert(testArticles)
  //         })
  //     })

  //     it('responds with 204 and updates the article', () => {
  //       const idToUpdate = 2
  //       const updateArticle = {
  //         title: 'updated article title',
  //         style: 'Interview',
  //         content: 'updated article content',
  //       }
  //       const expectedArticle = {
  //         ...testArticles[idToUpdate - 1],
  //         ...updateArticle
  //       }
  //       return supertest(app)
  //         .patch(`/api/articles/${idToUpdate}`)
  //         .send(updateArticle)
  //         .expect(204)
  //         .then(res =>
  //           supertest(app)
  //             .get(`/api/articles/${idToUpdate}`)
  //             .expect(expectedArticle)
  //         )
  //     })

  //     it(`responds with 400 when no required fields supplied`, () => {
  //       const idToUpdate = 2
  //       return supertest(app)
  //         .patch(`/api/articles/${idToUpdate}`)
  //         .send({ irrelevantField: 'foo' })
  //         .expect(400, {
  //           error: {
  //             message: `Request body must contain either 'title', 'style' or 'content'`
  //           }
  //         })
  //     })

  //     it(`responds with 204 when updating only a subset of fields`, () => {
  //       const idToUpdate = 2
  //       const updateArticle = {
  //         title: 'updated article title',
  //       }
  //       const expectedArticle = {
  //         ...testArticles[idToUpdate - 1],
  //         ...updateArticle
  //       }

  //       return supertest(app)
  //         .patch(`/api/articles/${idToUpdate}`)
  //         .send({
  //           ...updateArticle,
  //           fieldToIgnore: 'should not be in GET response'
  //         })
  //         .expect(204)
  //         .then(res =>
  //           supertest(app)
  //             .get(`/api/articles/${idToUpdate}`)
  //             .expect(expectedArticle)
  //         )
  //     })
  //   })
  // })
})