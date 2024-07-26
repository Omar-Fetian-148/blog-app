import { Types } from 'mongoose';
import { User, Comment } from '../../../data/models/index.js';
import { config } from "dotenv";
config()
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError
} from '../../../utils/helpers.js';
import validateComment from "../../../utils/validate/validateComment.js";
import { pubsub } from '../../../config/redis.js';


export default async (
  _,
  { body, postId },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    const isBlocked = await User.findOne({
      _id: new Types.ObjectId(user?._id),
      isBlocked: true
    })

    if (isBlocked) return generateError('unauthorized', language)

    
    const { error } = validateComment.validate(
      {
        body, postId
      },
      { abortEarly: false }
    );
    if (error) throw new Error(error.details.map((x) => x.message).join(', '));

    const comment = new Comment({
      postId: new Types.ObjectId(postId),
      body,
      userId: new Types.ObjectId(user?._id),
    })

    await comment.save()

    // comment.userId = user

    let data = {
      code: 200,
      message: `Comment is Created By ${user.username}`,
      success: true,
      data: comment,
    }

    await pubsub.publish('COMMENT_CREATED', { watchNewComments: data });

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    return mutationFailResponse(error)
  }
}