import { model, Schema } from 'mongoose';

const userActionSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['LIKE:POST', 'LIKE:COMMENT'],
      required: true
    },
  },
  { timestamps: true }
);

export default model('UserAction', userActionSchema);
