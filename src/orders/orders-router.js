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
    const {userId } = req.body
  
    var user_id = userId
    var today = new Date()
    const date = (today.getDate())
    const month = today.getMonth() +1
    const year = today.getFullYear()
    const time =  today.getTime();
    const date_created = date + "/" + month + "/" + year + "/" + time
    const newOrder = {user_id, date_created}
    for (const [key, value] of Object.entries(newOrder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    OrdersService.insertOrder(
      req.app.get('db'),
      newOrder
    )
      .then(order=> {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${order.id}`))
          .json(serializeOrder(order))
          // console.log("inserted")
      })
      .catch(next)
  })

ordersRouter.route('/addProduct')
.post(jsonParser, (req, res, next) => {
  // console.log("Route hit")
  //add validation all parameters have been pasd
    const userId =  req.body.user_id
    const productId =  req.body.product_id
    const quantity =  req.body.quantity
    const price =  req.body.price
    const timestamp =  req.body.timestamp
    const newOrderItem = {
      product_id : productId,
      quantity : quantity,
      price: price
    }
    
    OrdersService.getOrderId(
      req.app.get('db'), userId, timestamp
    ).then (res => {
      res.order_id
      // console.log(res)
      //return res
    })
    .then( obj => {
      newOrderItem.order_id = obj.order_Id
    } ).catch(next)

    // console.log(newOrderItem)
    // console.log("ORRDER ID " + newOrderItem.order_id )

    OrdersService.insertOrderItems(
      req.app.get('db') , newOrderItem
    ).then(orderItem => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${orderItem.id}`))
    }).catch(next)
})

ordersRouter
  .route('/:order_id')
  // .all((req, res, next) => {
  //   OrdersService.getById(
  //     req.app.get('db'),
  //     req.params.order_id
  //   )
  //     .then(order => {
  //       if (!order) {
  //         return res.status(404).json({
  //           error: { message: `Order doesn't exist` }
  //         })
  //       }
  //       res.order = order
  //       next()
  //     })
  //     .catch(next)
  // })
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