//------------------------ Queries -------------------------------------


//------------------------ Mutations -------------------------------------
import createPost from "../../controllers/mutations/post/createPost.js";

const postResolvers = {
  Mutation: {
    createPost,
  }
}

export default postResolvers