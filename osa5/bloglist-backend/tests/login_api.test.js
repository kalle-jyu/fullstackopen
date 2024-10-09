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

  const passwordHash = await bcrypt.hash('salaisuus', 10)
  const user = new User({ username: 'testi', passwordHash })

  await user.save()
})

describe('login tests', () => {

  test('login success with right credentials', async () => {

    const login = {
      username: 'testi',
      password: 'salaisuus',
    }

    await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('login fails with proper statuscode and error message', async () => {
    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/login')
      .send({ "username": 'jokumuu', "password": 'väärä' })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

})

after(async () => {
  await mongoose.connection.close()
})