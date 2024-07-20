import merge from 'lodash.merge';
import userResolvers from "./userResolvers.js";
import postResolvers from "./postResolvers.js";

const resolvers = merge(
  {},
  userResolvers,
  postResolvers,
  );

export default resolvers