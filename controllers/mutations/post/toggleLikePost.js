import { Types } from 'mongoose';
import { Post, UserAction } from '../../../data/models/index.js';
import { config } from "dotenv";
config()
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError
} from '../../../utils/helpers.js';


export default async (
  _,
  { postId },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    let post = await Post.findById(postId)

    if (!post) return generateError('checkYourInput', language)

    const isLiked = await UserAction.findOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(user?._id),
      action: 'LIKE:POST',
    })

    if (!isLiked) {
      post.likes++
      await UserAction.create({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(user?._id),
        action: 'LIKE:POST',
      })
    } else {
      post.likes--
      await UserAction.findOneAndDelete({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(user?._id),
        action: 'LIKE:POST',
      })
    }

    await post.save()

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    return mutationFailResponse(error)
  }
}