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
  { page },
  { user, language }
) => {
  try {
    if (!user) return generateError('unauthorized', language)
    if (!page || page <= 0) page = 1
    const viewLimit = 5;
    const skip = (page - 1) * viewLimit;

    const cachedPostData = await getCache(`userPosts:${user?._id}`);

    if (cachedPostData) {
    return mutationSuccessResponse('successfulOperation', language, cachedPostData)
    }

    const pipeLine = [
      {
        $facet: {
          posts: [
            {
              $lookup: {
                from: 'useractions',
                let: { postId: "$_id" },  // Ensure correct field name here
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$userId", new Types.ObjectId(user?._id)] },
                          { $eq: ["$postId", "$$postId"] }
                        ]
                      }
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
          ],
          totalCount: [
            {
              $count: 'count'
            }
          ]
        }
      }
    ]

    const result = await Post.aggregate(pipeLine)
    const posts = result[0].posts ?? []
    const count = result[0]?.totalCount[0]?.count ?? 0

    
    let data = {
      list: posts,
      pagination: {
        totalDocuments: count,
        viewLimit,
      },
    };

    await setCache(`userPosts:${user?._id}`, data, 10 * 60);

    return mutationSuccessResponse('successfulOperation', language, data)
  } catch (error) {
    return mutationFailResponse(error);
  }
}