import {
  User,
  Relationship
} from '../../../data/models/index.js';
import { Types } from "mongoose";
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
import { getCache, setCache } from "../../../config/redis.js";
export default async (
  _,
  { userId },
  { language, user }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    const following = await User.findById(userId)
    if (!following) return generateError('userNotFound', language)

    const isExist = await Relationship.findOne({
      userId: new Types.ObjectId(user?._id),
      followerId: new Types.ObjectId(userId),
    })

    if (isExist) return generateError('relationAlreadyExists', language)

    const relation = new Relationship({
      userId: new Types.ObjectId(user?._id),
      followerId: new Types.ObjectId(userId),
      relationType: 'FOLLOW'
    })
    await relation.save()

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    console.error("Error in user registration:", error);
    return mutationFailResponse(error);
  }
}