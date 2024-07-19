import { Readable } from 'stream';

import User from '../../../models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
  generateOTP,
} from "../../../utils/helpers.js";
import validateUserRegister from "../../../utils/validate/validateUserRegister.js";
import sendEmail from "../../../utils/sendEmail.js";
import generateProfilePictureUrl from "../../../utils/generateProfilePictureUrl.js";

export default async (
  _,
  { registerUserInput: { username, email, role, gender, password, confirmPassword, profilePicture } },
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

    if (profilePicture) {
      const { createReadStream } = await profilePicture?.promise;
      let profilePictureData = ''
      const stream = createReadStream();

      profilePictureData = (await generateProfilePictureUrl(stream,language));
      user.profilePicture = profilePictureData
    }
    
    const OTP = generateOTP(6)

    const user = new User({
      username,
      email,
      password,
      gender,
      role,
      OTP,
      OTPExpireDate : Date.now() + 3600000,
    })
    //await user.save()

    //await sendEmail(email, OTP)
    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}