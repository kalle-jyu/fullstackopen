const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./tests_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
let token = ''
let initialBlogs = []

beforeEach(async () => {

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salaisuus', 10)
  const user = new User({ username: 'testaaja', passwordHash })
  await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: "testaaja", password: "salaisuus" })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = response.body.token

  await Blog.deleteMany({})

  initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      user: user._id
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: user._id
    }
  ]

  const blogObjects = initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  const blogs = await Blog.find({})
  user.blogs = blogs.map(b => b._id)
  await user.save()
})

describe('Blog tests', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test(`blogs have an id-fields named 'id'`, async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.strictEqual('id' in blog, true)
      assert.strictEqual('_id' in blog, false)
    });
  })

  test('blog without like field gets 0 likes ', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const likes = response.body.map(r => r.likes)
    assert(likes, 0)
  })

  test.only('there are two blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test.only('the first blog is titled React patterns', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const contents = response.body.map(b => b.title)
    assert(contents.includes('React patterns'))
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 10
    }
    await api.post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = helper.blogsInDb()
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    const title = response.body.map(r => r.title)
    assert(title.includes('First class tests'))

  })

  test.only('blog without title is not added', async () => {
    const newBlog = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 0
    }

    await api.post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test.only('blog without url is not added', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 0
    }

    await api.post('/api/blogs')
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test.only('a specific blog can be viewed', async () => {
    const response = await api.get('/api/blogs')
    const blogsAtStart = response.body
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test.only('delete a blog when authorized', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    // Send DELETE request with Authorization header
    const url = `/api/blogs/${blogToDelete.id}`
    const response = await api
      .delete(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  });

  test.only('return 400 if no token is provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    // Send DELETE request with Authorization header
    const url = `/api/blogs/${blogToDelete.id}`
    // Send DELETE request without a token
    const response = await api
      .delete(url)
      .expect(400)
  });

  test.only('valid changes are updated ', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 93,
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[0].title, updatedBlog.title)
    assert.strictEqual(blogsAtEnd[0].author, updatedBlog.author)
    assert.strictEqual(blogsAtEnd[0].url, updatedBlog.url)
    assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)

  })

  test.only('blog without title is not updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]
    const updatedBlog = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
      likes: 0
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[1].title, blogToUpdate.title)
    assert.strictEqual(blogsAtEnd[1].author, blogToUpdate.author)
    assert.strictEqual(blogsAtEnd[1].url, blogToUpdate.url)
    assert.strictEqual(blogsAtEnd[1].likes, blogToUpdate.likes)
  })

  test.only('blog without url is not updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]
    const updatedBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      likes: 0
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.deepStrictEqual(blogsAtEnd[1], blogToUpdate)
  })

  after(async () => {
    await mongoose.connection.close()
  })

})

