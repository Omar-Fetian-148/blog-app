import { Types } from 'mongoose';
import { Comment, UserAction } from '../../../data/models/index.js';
import { config } from "dotenv";
config()
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError
} from '../../../utils/helpers.js';


export default async (
  _,
  { commentId },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    let comment = await Comment.findById(commentId)

    if (!comment) return generateError('checkYourInput', language)

    const isLiked = await UserAction.findOne({
      commentId: new Types.ObjectId(commentId),
      userId: new Types.ObjectId(user?._id),
      action: 'LIKE:COMMENT',
    })

    if (!isLiked) {
      comment.likes++
      await UserAction.create({
        commentId: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(user?._id),
        action: 'LIKE:COMMENT',
      })
    } else {
      comment.likes--
      await UserAction.findOneAndDelete({
        commentId: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(user?._id),
        action: 'LIKE:COMMENT',
      })
    }

    await comment.save()

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    return mutationFailResponse(error)
  }
}