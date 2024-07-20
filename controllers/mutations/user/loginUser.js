import User from '../../../models/User.js';
import { generateJWT } from '../../../utils/auth.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
export default async (
  _,
  { email, password },
  { language = 'en' }
) => {
  try {
    const user = await User.findOne({ email })
    if (!user) return generateError('invalidEmailOrPassword', language)
    if (!user.isVerified) return generateError('EmailIsNotVerified', language)

    const comparePass = await user.comparePassword(password)
    if (!comparePass) return generateError('invalidEmailOrPassword', language)

    const userJWTData = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role
    }

    const token = generateJWT(userJWTData)
    user.token = token
    user.numberOfLogins += 1
    user.lastLogin = new Date()
    await user.save()

    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);

  }
}