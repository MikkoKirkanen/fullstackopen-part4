import { readFile } from 'fs/promises'
import Blog from '../models/blog.js'

const initBlogs = JSON.parse(
  await readFile(new URL('../data/blogs.json', import.meta.url))
)

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

export default { initBlogs, blogsInDb }
