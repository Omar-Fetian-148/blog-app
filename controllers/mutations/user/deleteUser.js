import {
  User
} from '../../../data/models/index.js';
import { Types } from "mongoose";
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";

export default async (
  _,
  { userId },
  { language, user }
) => {
  try {
    if (!user) return generateError('unauthorized', language)
    if (user.role !== 'ADMIN') return generateError('unauthorized', language)

    const isDeleted = await User.findByIdAndDelete(userId)

    if (!isDeleted) return generateError('userNotFound', language)

    return mutationSuccessResponse('successfulOperation', language)
  } catch (error) {
    console.error("Error in user registration:", error);
    return mutationFailResponse(error);
  }
}