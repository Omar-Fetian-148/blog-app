import { Types } from 'mongoose';
import {  Comment } from '../../../data/models/index.js';
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

    const isDeleted = await Comment.findOneAndDelete({
      _id: new Types.ObjectId(commentId),
      ...(user.role !== 'ADMIN' && { userId: new Types.ObjectId(user?._id), })
    })

    if (!isDeleted) return generateError('unauthorized', language)

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    return mutationFailResponse(error)
  }
}