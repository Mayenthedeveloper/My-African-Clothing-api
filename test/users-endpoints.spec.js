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

    // context('Given there are users in the database', () => {
    //   const testUsers = makeUsersArray();
    // //   const testProducts = makeProductsArray();

    //   beforeEach('insert users', () => {
    //     return db
    //       .into('users')
    //       .insert(testUsers)
        
    //   })

    //   it('responds with 200 and all of the users', () => {
    //     return supertest(app)
    //       .get('/api/users')
    //       .expect(200, testUsers)
    //   })
    // })

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
        const userId = 2
        const expectedUser = testUsers[userId - 1]
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(200, expectedUser)
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


  
  describe(`POST /api/users`, () => {
    const testUsers = makeUsersArray();

   
    // beforeEach('insert user', () => {
    //   return db
    //     .into('users')
    //     .insert(testUsers)
    // })

    it.only(`creates a user, responding with 201 and the new User`, () => {
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

        const expected = new Date().toLocaleString('en', {timeZone: 'UTC'}) 
        const actual = new Date(res.body.date_created).toLocaleString()


          expect(actual).to.eql(expected)
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
    })
  })
})

