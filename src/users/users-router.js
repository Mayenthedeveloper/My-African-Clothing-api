const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    name: xss(user.name),
    email: xss(user.email),
    password: xss(user.password),
    
  })
  
  usersRouter
    .route('/')
    .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      UsersService.getAllUsers(knexInstance)
        .then(users => {
          res.json(users.map(serializeUser))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { password, name, email} = req.body

    for (const field of ['name', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check user_name doesn't start with spaces

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              name,
              password: hashedPassword,
              email,
              date_created: 'now()',
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(serializeUser(user))
              })
          })
      })
      .catch(next)
    })
  

  usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
      UsersService.getById(
        req.app.get('db'),
        req.params.user_id
      )
        .then(user => {
          if (!user) {
            return res.status(404).json({
              error: { message: `User doesn't exist` }
            })
          }
          res.user = user
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeUser(res.user))
    })
    .delete((req, res, next) => {
      UsersService.deleteUser(
        req.app.get('db'),
        req.params.user_id
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { name, email, password} = req.body
      const userToUpdate = { name, email, password }
  
      const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
      if (numberOfValues === 0)
        return res.status(400).json({
          error: {
            message: `Request body must contain either 'name', 'password' or 'email'`
          }
        })
  
      UsersService.updateUser(
        req.app.get('db'),
        req.params.user_id,
        userToUpdate
      )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })
  
  module.exports = usersRouter