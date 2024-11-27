import express from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user')
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findById(req.user.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.put('/', async (req, res) => {
  const blog = req.body
  await Blog.findByIdAndUpdate(blog.id, blog)
  res.status(200).json(blog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)

  if (blog && blog?.user?.toString() === req.user?.id) {
    await blog.deleteOne()
    return res.status(200).json({ message: 'Blog successfully deleted'})
  }
})

export default blogsRouter
