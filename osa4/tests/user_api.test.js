const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./tests_helper')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('user tests', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username or password is less than 3 characters or missing', async () => {
    const usersAtStart = await helper.usersInDb()

    let result = await api
      .post('/api/users')
      .send({
        username: 't1',
        name: 'Testi',
        password: 'salainen',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be at least 3 characters'))

    result = await api
      .post('/api/users')
      .send({
        name: 'Testi',
        password: 'salainen',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be at least 3 characters'))

    result = await api
      .post('/api/users')
      .send({
        username: 'Testi',
        name: 'Testi',
        password: 'a',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `password` to be at least 3 characters'))

    result = await api
      .post('/api/users')
      .send({
        username: 'Testi',
        name: 'Testi',
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `password` to be at least 3 characters'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  })


})

after(async () => {
  await mongoose.connection.close()
})