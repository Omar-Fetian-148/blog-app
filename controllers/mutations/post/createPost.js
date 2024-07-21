import { Types } from 'mongoose';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';
import { config } from "dotenv";
config()
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError
} from '../../../utils/helpers.js';
import validatePost from "../../../utils/validate/validatePost.js";
import { pubsub } from '../../../config/redis.js';


export default async (
  _,
  { title, body, category },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    const { error } = validatePost.validate(
      {
        title, body, category
      },
      { abortEarly: false }
    );
    if (error) throw new Error(error.details.map((x) => x.message).join(', '));

    const post = new Post({
      title,
      body,
      userId: new Types.ObjectId(user?._id),
      category
    })

    await post.save()

    post.userId = user

    let data = {
      code: 200,
      message: 'Post is Created successfully.',
      success: true,
      data: post,
    }

    await pubsub.publish('POST_CREATED', { watchNewPosts: data });

    return mutationSuccessResponse('successfulOperation', language, post)
  } catch (error) {
    return mutationFailResponse(error)
  }
}