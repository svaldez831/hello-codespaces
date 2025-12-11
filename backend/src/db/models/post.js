import mongoose, { Schema } from 'mongoose'
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: [String],
    imageUrl: { type: String, required: false },

    tags: [String],
  },
  { timestamps: true },
)
export const Post = mongoose.model('Post', postSchema)
