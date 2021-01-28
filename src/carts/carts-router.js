const path = require('path')
const express = require('express')
const xss = require('xss')
const CartsService = require('./carts-service')
const { ppid } = require('process')

const cartsRouter = express.Router()
const jsonParser = express.json()

const serializeCart = cart => ({
  id: cart.id,
  user_id: cart.user_id,
  
})

cartsRouter
  .route('/')
  .get((req, res, next) => {
    // const knexInstance = req.app.get('db')
    
    // CartsService.getAllProducts(knexInstance)
    //   .then(products => {
    //     res.json(products.map(serializeProduct))
    //   })
    //   .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id } = req.body
    const newCart = { user_id }

    for (const [key, value] of Object.entries(newCart))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newCart.user_id = user_id;
    
    

    CartsService.insertCart(
      req.app.get('db'),
      newCart
    )
      .then(cart => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${cart.id}`))
          .json(serializeCart(cart))
      })
      .catch(next)
  })

// productsRouter
//   .route('/:product_id')
//   .all((req, res, next) => {
//     ProductsService.getById(
//       req.app.get('db'),
//       req.params.product_id
//     )
//       .then(product => {
//         if (!product) {
//           return res.status(404).json({
//             error: { message: `Product doesn't exist` }
//           })
//         }
//         res.product = product
//         next()
//       })
//       .catch(next)
//   })
//   .get((req, res, next) => {
//     res.json(serializeProduct(res.product))
//   })
//   .delete((req, res, next) => {
//     ProductsService.deleteProduct(
//       req.app.get('db'),
//       req.params.product_id
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })
//   .patch(jsonParser, (req, res, next) => {
//     const { price, size, description } = req.body
//     const productToUpdate = { price, size, description}

//     const numberOfValues = Object.values(productToUpdate).filter(Boolean).length
//     if (numberOfValues === 0)
//       return res.status(400).json({
//         error: {
//           message: `Request body must contain either 'price' 'size' or 'description'`
//         }
//       })

//     ProductsService.updateProduct(
//       req.app.get('db'),
//       req.params.product_id,
//       productToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })

module.exports = cartsRouter