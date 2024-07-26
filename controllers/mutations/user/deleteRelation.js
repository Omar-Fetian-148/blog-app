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

    const following = await User.findById(userId)
    if (!following) return generateError('userNotFound', language)

    const isExist = await Relationship.findOneAndDelete({
      primaryUserId: new Types.ObjectId(userId),
      secondaryUserId: new Types.ObjectId(user?._id),
      relationType
    })

    if (!isExist) return generateError('relationNotFound', language)

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    console.error("Error in user registration:", error);
    return mutationFailResponse(error);
  }
}