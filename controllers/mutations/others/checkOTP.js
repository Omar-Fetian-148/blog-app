import User from '../../../data/models/User.js';
import {
  mutationFailResponse,
  mutationSuccessResponse,
  generateError,
} from "../../../utils/helpers.js";

export default async (
  _,
  { OTP, email },
  { language }
) => {
  try {
    let user = await User.findOne({
      email,
      OTP,
      OTPExpireDate: { $gt: Date.now() }
    })

    if (!user) return generateError('invalidOTP', language)

    user.isVerified = true
    await user.save()

    return mutationSuccessResponse('successfulOperation', language, user)
  } catch (error) {
    return mutationFailResponse(error);
  }
}