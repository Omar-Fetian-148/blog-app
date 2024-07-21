import User from '../../../models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
import { getCache, setCache } from "../../../config/redis.js";

export default async (
  _,
  __,
  { language = 'en', user }
) => {
  try {
    if (!user) return generateError('unauthorized', language)

    const cachedUserData = await getCache(`user:${user?._id}`);
    if (cachedUserData) {
      console.log('Data Cached');
      return mutationSuccessResponse('successfulOperation', language, cachedUserData)
    }

    const userData = await User.findById(user?._id)
    await setCache(`user:${user?._id}`, user, 10 * 60);

    return mutationSuccessResponse('successfulOperation', language, userData)
  } catch (error) {
    return mutationFailResponse(error);
  }
}