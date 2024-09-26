const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.status(200).json(blog)
})


blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.title === undefined 
    || body.url === undefined
    || body.title === ''
    || body.url === ''
  ) 
  {
    response.status(400).json()
  } else {
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }

    const blog = new Blog(newBlog)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

  }

})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  if (body.title === undefined 
    || body.url === undefined
    || body.title === ''
    || body.url === ''
  ) 
  {
    response.status(400).json()
  } else {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }

    const updatedBlog = Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.status(200).json(updatedBlog)
    })
    .catch(error => next(error))
  }
})

module.exports = blogsRouter