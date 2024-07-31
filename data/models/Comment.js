import { model, Schema } from 'mongoose';

const commentSchema = new Schema({
  body: {
    type: String,
    required: [true, 'comment body is required'],
    trim: true,
    minlength: 2,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'postId is required'],
  },
  likes: {
    type: Number,
    default: 0
  },
}, { timestamps: true }
)

export default model('Comment', commentSchema);
