const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersProductsService = require('./user-products-service')
const { ppid } = require('process')
const { Console } = require('console')

const UsersProductsRouter = express.Router()
const jsonParser = express.json()

const serializeUserProducts = userProduct => ({
  id: userProduct.id,
  user_id: userProduct.user_id,
  product_id: userProduct.product_id
  
})

UsersProductsRouter
  .route('/')
  // .get((req, res, next) => {
  //   const knexInstance = req.app.get('db')
  //   const {user_id} = req.query

  //   if(user_id){
  //     UsersProductsService.getProductsOfUsers(knexInstance, user_id)
  //     .then(userProducts => {
  //       res.json(userProducts.map(serializeUserProducts))
  //     })
  //     .catch(next)
  //   }else{

  //     UsersProductsService.getAllUsersProducts(knexInstance)
  //       .then(userProducts => {
  //         res.json(userProducts.map(serializeUserProducts))
  //       })
  //       .catch(next)
  //   }


  // })
  .post(jsonParser, (req, res, next) => {
    const { user_id, product_id} = req.body
    const newUserProduct = { user_id, product_id}

    console.log(newUserProduct)
    for (const [key, value] of Object.entries(newUserProduct))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    

    UsersProductsService.insertUsersProducts(
      req.app.get('db'),
      newUserProduct
    )
      .then(userProduct => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${userProduct.id}`))
          .json(serializeUserProducts(userProduct))
      })
      .catch(next)
  })

  UsersProductsRouter
  .route('/:user_id')
  .all((req, res, next) => {
    // console.log('test')

    UsersProductsService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(({rows}) => {
        console.log(rows)
        if (!rows) {
          return res.status(404).json({
            error: { message: `UserProduct doesn't exist` }
          })
        }
        res.cart = rows
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.cart)
  })
  .delete(jsonParser, (req, res, next) => {
    UsersProductsService.deleteUsersProducts(
      req.app.get('db'),
      req.body.product_id
    )
      .then(()=> {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_id, product_id } = req.body
    const newUserProductToUpdate = { user_id, product_id}

    const numberOfValues = Object.values(newUserProductToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'Product_id or 'User_id'`
        }
      })

      UsersProductsService.updateUsersProducts(
      req.app.get('db'),
      req.params.id,
      newUserProductToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = UsersProductsRouter