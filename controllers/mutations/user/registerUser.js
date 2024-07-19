import User from '../../../models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";
import validateUserRegister from "../../../utils/validate/validateUserRegister.js";

export default async (
  _,
  { registerUserInput: { username, email, role, gender, password, confirmPassword } },
  { language = 'en' }
) => {
  try {

    const { error } = validateUserRegister.validate(
      {
        username, email, password, confirmPassword
      },
      { abortEarly: false }
    );
    if (error) throw new Error(error.details.map((x) => x.message).join(', '));
    
    const isExist = await User.findOne({ $or: [{ email }, { username }] })
    if (isExist) return generateError('userAlreadyExists', language)

    const matchedPass = password === confirmPassword ? true : false;
    if (!matchedPass) return generateError('passwordNotMatch', language)

    const user = new User({
      username,
      email,
      password,
      gender,
      role
    })
    await user.save()

    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}