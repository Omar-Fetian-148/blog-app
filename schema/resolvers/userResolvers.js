import loginUser from "../../controllers/mutations/user/loginUser.js";
import registerUser from "../../controllers/mutations/user/registerUser.js";

const userResolvers = {
  Query: {
    hello: () => 'world',
  },
  Mutation: {
    loginUser,
    registerUser,
  }
}

export default userResolvers