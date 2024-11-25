import { test, after, describe, before } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'

const api = supertest(app)
const blogs_url = '/api/blogs'

describe('Blogs', () => {
  const author = 'Mikko Kirkanen'
  // Clear and initialize DB
  before(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initBlogs)
  })

  // Exercise 4.8
  test('should returned as json and correct amount of blogs', async () => {
    const res = await api
      .get(blogs_url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.length, helper.initBlogs.length)
  })

  // Exercise 4.9
  test('should be an correct identifier (id) field for all', async () => {
    const res = await api.get(blogs_url)
    const hasEveryId = res.body?.every((obj) => obj.id !== undefined)
    assert(hasEveryId)
  })

  describe('New Blog', () => {
    const newBlog = {
      title: "Mikko Kirkanen's website",
      author: author,
      url: 'https://mikkokirkanen.fi',
    }

    // Exercises 4.10 and 4.11
    test('should have valid data and likes 0 by default', async () => {
      const res = await api
        .post(blogs_url)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initBlogs.length + 1)

      const createdBlog = blogsAtEnd.find(
        (b) => b.id === res.body.id
      )
      assert.strictEqual(createdBlog.author, author)

      // Exercise 4.11 test
      assert.strictEqual(createdBlog.likes, 0)
    })

    // Exercise 4.12
    test('should fail if title is undefined', async () => {
      const noTitle = { ...newBlog }
      delete noTitle.title

      await api.post(blogs_url).send(noTitle).expect(400)
    })

    // Exercise 4.12
    test('should fail if url is undefined', async () => {
      const noUrl = { ...newBlog }
      delete noUrl.url

      await api.post(blogs_url).send(noUrl).expect(400)
    })
  })

  describe('Blog Management', () => {
    // Exercise 4.14
    test('should modify one blog', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs.find((b) => b.author === author)
      blog.likes = 7

      await api.put(blogs_url).send(blog).expect(200)

      const blogsAfter = await helper.blogsInDb()
      const updatedBlog = blogsAfter.find((b) => b.id === blog.id)
      assert.strictEqual(updatedBlog.likes, 7)
    })

    // Exercise 4.13
    test('should remove one blog', async () => {
      const blogs = await helper.blogsInDb()
      const blog = blogs.find((b) => b.author === author)

      await api.delete(`${blogs_url}/${blog.id}`).expect(204)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, blogs.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
