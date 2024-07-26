import {
  User,
} from '../../../data/models/index.js';
import { Types } from "mongoose";
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";

export default async (
  _,
  { userId, action },
  { language, user }
) => {
  try {
    if (!user) return generateError('unauthorized', language)
    if (user.role !== 'ADMIN') return generateError('unauthorized', language)

    if (userId.toString() === user?._id.toString()) return generateError('relationNotPossible', language)

    let targetUser = await User.findById(userId)
    if (!targetUser) return generateError('userNotFound', language)

    if (action === 'BLOCK') {
      targetUser.isBlocked = true
    } else {
      targetUser.isBlocked = false
    }

    await targetUser.save()
    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    console.error("Error in user registration:", error);
    return mutationFailResponse(error);
  }
}