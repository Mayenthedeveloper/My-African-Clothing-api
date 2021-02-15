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
      connection: process.env.TEST_DATABASE_URL ,
    })
    app.set('db', db)

  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE users, user_products, products RESTART IDENTITY CASCADE'))

  afterEach('cleanup',() => db.raw('TRUNCATE users, user_products, products RESTART IDENTITY CASCADE'))



  describe(`GET /api/cart/:user_id`, () => {
   
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
            .insert(testProducts[0])
            .then(()=>{
               return db
                .into('user_products')
                .insert(testUProducts[0])
            })
         })
          
      })

      it('responds with 200 and the specified product', () => {
        const userId = 10
        const expectedProduct =   [{
            id: 1,
            product_id: 1,
            category:  'Skirt and Blouse',
            image: '/images/snb1.png',
            size: 'medium',
            price: '19.99',
            brand: 'Ankara',
            name: 'Skirt and Blouse',
            description: ''
        }]
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
          .expect(404, { error: { message: `UserProduct doesn't exist` } })
      })
    })

    context('Given there are product in the database', () => {
    
      const testUProducts = makeUPArray()
      const testUsers = makeUsersArray()
      const testProducts = makeProductsArray()
      

      beforeEach('insert products', () => {
        return db
          .into('users')
          .insert(testUsers[0])
          .then(() => {
            return db
              .into('products')
              .insert(testProducts[0])
              .then(()=>{
                return db
              .into('user_products')
              .insert(testUProducts[0])
              })
              
          })
      })

      it('responds with 204 and removes the Product', () => {
        const idToRemove = {
            product_id : 1
        }
        const userID = 10
        //const expectedProduct = testProducts.filter(product => product.id == idToRemove)
        return supertest(app)
          .delete(`/api/cart/${userID}`)
          .send(idToRemove)
          .expect(204)
        
      })
    })
  })
})