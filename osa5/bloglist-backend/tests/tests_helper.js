const Blog = require('../models/blog')
const User = require('../models/user')

const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'willremovethissoon',
      author: 'willremovethissoon',
      url: 'http://www.fi',
      likes: 0
    }
  )
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb
}
