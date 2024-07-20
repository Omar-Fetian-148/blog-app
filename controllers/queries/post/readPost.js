import { Types } from "mongoose";
import Post from '../../../models/Post.js';
import User from "../../../models/User.js";
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
import { getCache, setCache } from "../../../config/redis.js";

export default async (
  _,
  { postId },
  { language = 'en', auth }
) => {
  try {
    const user = await User.findById(auth?._id)
    if (!user) return generateError('unauthorized', language)

    const cachedPostData = await getCache(`post:${postId}`);

    if (cachedPostData) {
      return mutationSuccessResponse('successfulOperation', language, cachedPostData)
    }

    const post = await Post.findById(postId).populate({
      path: 'userId',
      select: '-_id username profilePicture'
    });
    await setCache(`post:${postId}`, post, 10 * 60);

    return mutationSuccessResponse('successfulOperation', language, post)
  } catch (error) {
    return mutationFailResponse(error);
  }
}