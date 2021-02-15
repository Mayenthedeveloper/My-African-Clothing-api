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
      connection: process.env.TEST_DATABASE_URL ,
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
  })

  
})