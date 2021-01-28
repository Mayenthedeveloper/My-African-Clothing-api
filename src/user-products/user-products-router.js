const path = require('path')
const express = require('express')
const xss = require('xss')
const ProductsService = require('./user-products-service')
const { ppid } = require('process')

const productsRouter = express.Router()
const jsonParser = express.json()

const serializeProduct = products => ({
  id: products.id,
  name: products.name,
  category: products.category,
  image: products.image,
  price: products.price,
  brand: products.brand,
  size: products.size,
  description: products.description
})

productsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    ProductsService.getAllProducts(knexInstance)
      .then(products => {
        res.json(products.map(serializeProduct))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, category, image, price, brand, size, description } = req.body
    const newProduct = { name, price, image, category, brand, size, description }

    for (const [key, value] of Object.entries(newProduct))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newProduct.name = name;
    newProduct.price = price;
    newProduct.image = image;
    newProduct.size = size;
    

    ProductsService.insertProduct(
      req.app.get('db'),
      newProduct
    )
      .then(product => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${product.id}`))
          .json(serializeComment(product))
      })
      .catch(next)
  })

productsRouter
  .route('/:product_id')
  .all((req, res, next) => {
    ProductsService.getById(
      req.app.get('db'),
      req.params.product_id
    )
      .then(product => {
        if (!product) {
          return res.status(404).json({
            error: { message: `Product doesn't exist` }
          })
        }
        res.product = product
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeProduct(res.product))
  })
  .delete((req, res, next) => {
    ProductsService.deleteProduct(
      req.app.get('db'),
      req.params.product_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { price, size, description } = req.body
    const productToUpdate = { price, size, description}

    const numberOfValues = Object.values(productToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'price' 'size' or 'description'`
        }
      })

    ProductsService.updateProduct(
      req.app.get('db'),
      req.params.product_id,
      productToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = productsRouter