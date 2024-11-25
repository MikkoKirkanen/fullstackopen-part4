import mongoose from 'mongoose'

const blogSchema = mongoose.Schema({
  title: {type:String, required: true},
  author: String,
  url: {type:String, required: true},
  likes: { type: Number, default: 0 },
})

const Blog = mongoose.model('Blog', blogSchema)

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

export default Blog
