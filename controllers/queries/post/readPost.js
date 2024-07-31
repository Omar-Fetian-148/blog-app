import { Types } from "mongoose";
import Post from '../../../data/models/Post.js';
import User from "../../../data/models/User.js";
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
import { getCache, setCache } from "../../../config/redis.js";

export default async (
  _,
  { postId },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    const cachedPostData = await getCache(`post:${postId}`);

    if (cachedPostData) {
      return mutationSuccessResponse('successfulOperation', language, cachedPostData)
    }

    const pipeLine = [
      {
        $lookup: {
          from: 'useractions',
          pipeline: [
            {
              $match: {
                userId: new Types.ObjectId(user?._id),
                postId: new Types.ObjectId(postId),
              }
            }
          ],
          as: 'isThereALike'
        }
      },
      {
        $addFields: {
          isLiked: {
            $cond: {
              if: { $eq: [{ $size: "$isThereALike" }, 0] },
              then: false,
              else: true
            }
          }
        }
      }
    ]

    const data = await Post.aggregate(pipeLine)
    const post = data[0] ?? []

    console.log(post);

    await setCache(`post:${postId}`, post, 10 * 60);

    return mutationSuccessResponse('successfulOperation', language, post)
  } catch (error) {
    return mutationFailResponse(error);
  }
}