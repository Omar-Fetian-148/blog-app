import User from '../../../models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
export default async (
  _,
  { registerUserInput: { username, email, gender, password, confirmPassword } },
  { language = 'en' }
) => {
  try {
    const isExist = await User.findOne({ $or: [{ email }, { username }] })
    if (isExist) return generateError('userAlreadyExists', language)

    const matchedPass = password === confirmPassword ? true : false;
    if (!matchedPass) return generateError('passwordNotMatch', language)

    const user = new User({
      username,
      email,
      password,
      gender
    })
    await user.save()

    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}