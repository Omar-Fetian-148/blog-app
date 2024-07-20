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
  { language = 'en', auth }
) => {
  try {
    if (!auth) return generateError('unauthorized', language)

    const cachedUserData = await getCache(`user:${auth?._id}`);
    if (cachedUserData) {
      console.log('Data Cached');
      return mutationSuccessResponse('successfulOperation', language, cachedUserData)
    }

    const user = await User.findById(auth?._id)
    let flag = await setCache(`user:${auth?._id}`, user, 10 * 60);

    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}