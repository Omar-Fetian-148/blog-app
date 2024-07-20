//------------------------ Queries -------------------------------------
import readPost from "../../controllers/queries/post/readPost.js";


//------------------------ Mutations -------------------------------------
import createPost from "../../controllers/mutations/post/createPost.js";
import { Query } from "mongoose";

const postResolvers = {
  Query: {
    readPost
  },
  Mutation: {
    createPost,
  }
}

export default postResolvers