import User from '../../../data/models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
  generateOTP,
} from "../../../utils/helpers.js";
import sendEmail from "../../../utils/sendEmail.js";

export default async (
  _,
  { email },
  { language = 'en' }
) => {
  try {
    const user = await User.findOne({ email })
    if (!user) return generateError('invalidEmailOrPassword', language)

    const OTP = generateOTP(6)
    const OTPExpiryTime = 3 * 60 * 1000
    user.OTP = OTP
    user.OTPExpireDate = Date.now() + OTPExpiryTime,

      await user.save()

    await sendEmail(email, OTP, OTPExpiryTime / (1000 * 60))
    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}