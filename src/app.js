require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./users/users-router')
const productsRouter = require('./products/products-router')
const authRouter = require('./auth/auth-router')
const cartRouter = require('./carts/carts-router')
const orderRouter = require('./orders/orders-router')
const usersProductsRouter = require('./user-products/user-products-router')

const app = express()

// app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
//   skip: () => NODE_ENV === 'test'
// }))

 const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
 app.use(morgan(morganSetting))


app.use(helmet())
app.use(cors())
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)

app.use('/api/cart', usersProductsRouter)

app.get('/', (req, res) =>{
    res.send('Hello, world!')
})



app.use(function errorHandler(error, req, res, next) {
      let response
      if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

module.exports = app