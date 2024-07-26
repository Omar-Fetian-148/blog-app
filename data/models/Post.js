import { model, Schema } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'post title is required'],
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  body: {
    type: String,
    required: [true, 'post body is required'],
    trim: true,
    minlength: 5,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'post category is required'],
    enum: ['SPORT', 'TECH', 'NEWS ', 'ENTERTAINMENT', 'HEALTH', 'FINANCE', 'EDUCATION', 'SCIENCE', 'ART'],
    trim: true,
    minlength: 3,
    maxlength: 10
  },
  image: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2019/04/29/16/11/work-4166473_1280.png"
  },
  likes: {
    type: Number,
    default: 0
  },
  disLikes: {
    type: Number,
    default: 0
  }
}, { timestamps: true }
)

export default model('Post', postSchema);