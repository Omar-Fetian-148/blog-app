//------------------------ Queries -------------------------------------
import me from "../../controllers/queries/user/me.js"

//------------------------ Mutations -------------------------------------
import loginUser from "../../controllers/mutations/user/loginUser.js";
import registerUser from "../../controllers/mutations/user/registerUser.js";
import sendOTP from "../../controllers/mutations/others/sendOTP.js";
import checkOTP from "../../controllers/mutations/others/checkOTP.js";
import createRelation from "../../controllers/mutations/user/createRelation.js";
import deleteRelation from "../../controllers/mutations/user/deleteRelation.js";

const userResolvers = {
  Query: {
    me
  },
  Mutation: {
    loginUser,
    registerUser,
    sendOTP,
    checkOTP,
    createRelation,
    deleteRelation,
  }
}

export default userResolvers