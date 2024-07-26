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

export default async (
  _,
  { userId, relationType },
  { language, user }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    if (userId.toString() === user?._id.toString()) return generateError('relationNotPossible', language)

    const following = await User.findById(userId)
    if (!following) return generateError('userNotFound', language)

    const isExist = await Relationship.findOne({
      primaryUserId: new Types.ObjectId(userId),
      secondaryUserId: new Types.ObjectId(user?._id),
    })

    if (isExist?.relationType === 'FOLLOW' && relationType === 'BLOCK') {
      isExist.relationType = 'BLOCK'
      await isExist.save()
      return mutationSuccessResponse('successfulOperation', language)
    }

    if (isExist) return generateError('relationAlreadyExists', language)

    const relation = new Relationship({
      primaryUserId: new Types.ObjectId(userId),
      secondaryUserId: new Types.ObjectId(user?._id),
      relationType
    })

    await relation.save()

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    console.error("Error in user registration:", error);
    return mutationFailResponse(error);
  }
}