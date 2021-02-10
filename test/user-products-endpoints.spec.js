const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const {makeUPArray} = require ('./usersproduct.fixtures')

const { makeUsersArray } = require('./users.fixtures')

const { makeProductsArray } = require('./products.fixtures')



describe('User Product Endpoints', function() {
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

//   describe(`GET /api/products`, () => {
//     context(`Given no products`, () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app)
//           .get('/api/products')
//           .expect(200, [])
//       })
//     })

//     context('Given there are products in the database', () => {
//       const testUsers = makeUsersArray();
//       const testProducts = makeProductsArray();

//       beforeEach('insert products', () => {
//         return db
//           .into('users')
//           .insert(testUsers)
//           .then(() => {
//             return db
//               .into('products')
//               .insert(testProducts)
//           })
//       })

//       it('responds with 200 and all of the products', () => {
//         return supertest(app)
//           .get('/api/products')
//           .expect(200, testProducts)
//       })
//     })

//      context('Given there are products in the database', () => {
//       const testUsers = makeUsersArray();
//       const testProducts = makeProductsArray();

//       beforeEach('insert products', () => {
//         return db
//           .into('users')
//           .insert(testUsers)
//           .then(() => {
//             return db
//               .into('products')
//               .insert(testProducts)
//           })
//       })

//       it('responds with 200 and all of the products', () => {
//         return supertest(app)
//           .get('/api/products')
//           .expect(200, testProducts)
//       })
//     })

//   })

  describe.only(`GET /api/cart/:user_id`, () => {
    // context(`Given no product_id`, () => {
    //   it(`responds with 404`, () => {
    //     const productId = 123456
    //     return supertest(app)
    //       .get(`/api/cart/${productId}`)
    //       .expect(404, { error: { message: `Product_id doesn't exist` } })
    //   })
    // })

    context('Given there are product in the database', () => {
      const testUProducts = makeUPArray()
      const testUsers = makeUsersArray()
      const testProducts = makeProductsArray()



      beforeEach('insert products', () => {
        return db
         .into('users')
         .insert(testUsers[0]) 
         .then(()=>{
            return db
            .into('products')
            .insert(testProducts)
            .then(()=>{
               return db
                .into('user_products')
                .insert(testUProducts)
            })
         })
          
      })

      it('responds with 200 and the specified product', () => {
        const userId = 1
        const expectedProduct =   {
            id: 1,
            product_id:1,
            name: 'Skirt and Blouse',
            category:  'Skirt and Blouse',
            image: '/images/snb1.png',
            price: '19.99',
            brand: 'Ankara',
            size: 'medium',
            description: ''
        }
        return supertest(app)
          .get(`/api/cart/${userId}`)
          .expect(200, expectedProduct)
      })
    })
  })

  describe(`DELETE /api/cart/:product_id`, () => {
    context(`Given no product`, () => {
      it(`responds with 404`, () => {
        const upId = 123456
        return supertest(app)
          .delete(`/api/cart/${upId}`)
          .expect(404, { error: { message: `product doesn't exist` } })
      })
    })

    context('Given there are product in the database', () => {
      const testProducts = makeUPArray();
      

      beforeEach('insert products', () => {
        return db
          .into('user_id')
          .insert(testProducts)
          .then(() => {
            return db
              .into('product_id')
              .insert(testProducts)
          })
      })

      it('responds with 204 and removes the Product', () => {
        const idToRemove = 2
        const expectedProduct = testProducts.filter(product => product.id !== idToRemove)
        return supertest(app)
          .delete(`/api/cart/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/cart`)
              .expect(expectedProduct)
          )
      })
    })
  })
})