const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const bcrypt = require('bcryptjs')
const {makeProductsArray} = require ('./products.fixtures')

const { makeUsersArray } = require('./users.fixtures')



describe('Users Endpoints', function() {
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

  describe(`GET /api/users`, () => {
    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, [])
      })
    })


     context('Given there are users in the database', () => {
      const testUsers = makeUsersArray();
    //   const testProducts = makeProductsArray();

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
        
      })

      it('responds with 200 and all of the users', () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, testUsers)
      })
    })

    
  })

  describe(`GET /api/users/:user_id`, () => {
    context(`Given no user`, () => {
      it(`responds with 404`, () => {
        const productId = 123456
        return supertest(app)
          .get(`/api/users/${productId}`)
          .expect(404, { error: { message: `User doesn't exist` } })
      })
    })

    context('Given there are user in the database', () => {
      const testUsers = makeUsersArray();
    //   const testProducts = makeProductsArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
        
      })

      it('responds with 200 and the specified user', () => {
        const userId = 20
        const expectedUser = testUsers[1]
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(200, expectedUser)
      })
    })

    
  })


  
  describe(`POST /api/users`, () => {
    const testUsers = makeUsersArray();

   
    beforeEach('insert user', () => {
      return db
        .into('users')
        .insert(testUsers)
    })

    it(`creates a user, responding with 201 and the new User`, () => {
      const newUser = {
        name: 'James',
        email: 'jaes@yahoo.com',
        password: 'P@ssword1' ,
        
        
      }
      return supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newUser.name)
          expect(res.body.email).to.eql(newUser.email)
        //   expect(res.body.password).to.eql(newUser.password) 
        // expect(bcrypt.compare(res.body.password, newUser.password)).to.eql(true)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
        //   const expected = new Intl.DateTimeFormat('en-US').format(new Date())
        //   const actual = new Intl.DateTimeFormat('en-US').format(new Date(res.body.date_created))

        // const expected = new Date().toLocaleString('en', {timeZone: 'UTC'}) 
        // const actual = new Date(res.body.date_created).toLocaleString()


        //   expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/users/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['name', 'email', 'password']

    requiredFields.forEach(field => {
      const newUser = {
        name: 'Test new user',
        email: 'xyx@yahoo.com',
        password: 'P@ssword1'
       
      }

    })
  })

  // describe(`DELETE /api/users/:user_id`, () => {
  //   context(`Given no users`, () => {
  //     it(`responds with 404`, () => {
  //       const userId = 123456
  //       return supertest(app)
  //         .delete(`/api/users/${userId}`)
  //         .expect(404, { error: { message: `User doesn't exist` } })
  //     })
  //   })

  //   context('Given there are users in the database', () => {
  //     const testUsers = makeUsersArray();
  //     const testProducts = makeProductsArray()

  //     beforeEach('insert users', () => {
  //       return db
  //         .into('users')
  //         .insert(testUsers)
  //         .then(() => {
  //           return db
  //             .into('products')
  //             .insert(testProducts)
  //         })
  //     })

  //     it('responds with 204 and removes the user', () => {
  //       const idToRemove = 2
  //       const expectedUser= testUsers.filter(user => user.id !== idToRemove)
  //       return supertest(app)
  //         .delete(`/api/users/${idToRemove}`)
  //         .expect(204)
  //         .then(res =>
  //           supertest(app)
  //             .get(`/api/users`)
  //             .expect(expectedUser)
  //         )
  //     })
  //   })
  // })
  
})

