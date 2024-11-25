import express from 'express'
import Blog from '../models/blog.js'

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.put('/', async (req, res) => {
  const blog = req.body;
  await Blog.findByIdAndUpdate(blog.id, blog)
  res.status(200).json(blog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

export default blogsRouter
