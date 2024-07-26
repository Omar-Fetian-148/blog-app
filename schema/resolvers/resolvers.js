import merge from 'lodash.merge';
import userResolvers from "./userResolvers.js";
import postResolvers from "./postResolvers.js";
import commentResolvers from "./commentResolvers.js";

const resolvers = merge(
  {},
  userResolvers,
  postResolvers,
  commentResolvers
  );

export default resolvers