//------------------------ Queries -------------------------------------
import readPost from "../../controllers/queries/post/readPost.js";


//------------------------ Mutations -------------------------------------
import createPost from "../../controllers/mutations/post/createPost.js";

//------------------------ Subscriptions -------------------------------------
import watchNewPosts from "../../controllers/Subscriptions/post/watchNewPosts.js";

const postResolvers = {
  Query: {
    readPost
  },
  Mutation: {
    createPost,
  },
  Subscription: {
    watchNewPosts: {
      subscribe: watchNewPosts,
    }
  }
}

export default postResolvers