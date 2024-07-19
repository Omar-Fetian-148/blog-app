import merge from 'lodash.merge';
import userResolvers from "./userResolvers.js";

const resolvers = merge(
  {},
  userResolvers,
  //
  );

export default resolvers