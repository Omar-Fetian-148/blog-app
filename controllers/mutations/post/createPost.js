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
export default async (
  _,
  { title, body, category },
  { auth, language }
) => {
  try {
    const user = await User.findById(auth?._id)
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
      userId: new Types.ObjectId(auth?._id)
    })

    await post.save()

    return mutationSuccessResponse('successfulOperation', language, post)
  } catch (error) {
    return mutationFailResponse(error)
  }
}