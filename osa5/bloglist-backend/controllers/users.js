const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { error } = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  let errors = []

  if (typeof username !== "string" || username.length < 3) {
    errors.push('expected `username` to be at least 3 characters')
  }
  if (typeof password !== "string" || password.length < 3) {
    errors.push('expected `password` to be at least 3 characters')
  }

  if (errors.length > 0) {
    return response.status(400).json({ "error": errors })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter