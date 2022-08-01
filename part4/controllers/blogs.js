const Blog = require('../models/blog');
const blogsRouter = require('express').Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
});

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body)

  blog
    .save()
    response.status(201).json(blog)
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
});

blogsRouter.put('/:id', async (request, response) => {
  
  const body = request.body

  const newBlog = {
    id: body.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
};

  await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(newBlog);
});

module.exports = blogsRouter