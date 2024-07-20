//------------------------ Queries -------------------------------------
import me from "../../controllers/queries/user/me.js"

//------------------------ Mutations -------------------------------------
import loginUser from "../../controllers/mutations/user/loginUser.js";
import registerUser from "../../controllers/mutations/user/registerUser.js";
import sendOTP from "../../controllers/mutations/user/sendOTP.js";
import checkOTP from "../../controllers/mutations/user/checkOTP.js";

const userResolvers = {
  Query: {
    me
  },
  Mutation: {
    loginUser,
    registerUser,
    sendOTP,
    checkOTP,
  }
}

export default userResolvers