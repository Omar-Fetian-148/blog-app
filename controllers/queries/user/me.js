import User from '../../../models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
export default async (
  _,
  __,
  { language = 'en', auth }
) => {
  try {
    const user = await User.findById(auth?._id)
    if (!user) return generateError('unauthorized', language)

    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}