const path = require('path')
const express = require('express')
const xss = require('xss')
const OrdersService = require('./orders-service')
const { ppid } = require('process')

const ordersRouter = express.Router()
const jsonParser = express.json()

const serializeOrder = orders => ({
  id: orders.order_id,
  
})

ordersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    OrdersService.getAllOrders(knexInstance)
      .then(orders => {
        res.json(orders.map(serializeOrder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { orderitem_id, order_id, product_id, quantity, price } = req.body
    const newOrder= { orderitem_id, order_id, product_id, quantity, price }

    for (const [key, value] of Object.entries(newOrder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newOrder.quantity = quantity;
    newOrder.price = price;
    
    

    OrdersService.insertOrder(
      req.app.get('db'),
      newOrder
    )
      .then(order=> {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${order.id}`))
          .json(serializeComment(order))
      })
      .catch(next)
  })

ordersRouter
  .route('/:order_id')
  .all((req, res, next) => {
    OrdersService.getById(
      req.app.get('db'),
      req.params.order_id
    )
      .then(order => {
        if (!order) {
          return res.status(404).json({
            error: { message: `Order doesn't exist` }
          })
        }
        res.order = order
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeOrder(res.order))
  })
  .delete((req, res, next) => {
    OrdersService.deleteOrder(
      req.app.get('db'),
      req.params.order_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { quantity, price } = req.body
    const orderToUpdate = { quantity, price}

    const numberOfValues = Object.values(productToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'price' 'size' or 'description'`
        }
      })

    OrdersService.updateOrder(
      req.app.get('db'),
      req.params.order_id,
      orderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = ordersRouter