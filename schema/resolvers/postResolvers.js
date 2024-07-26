//------------------------ Queries -------------------------------------
import readPost from "../../controllers/queries/post/readPost.js";


//------------------------ Mutations -------------------------------------
import createPost from "../../controllers/mutations/post/createPost.js";
import toggleLike from "../../controllers/mutations/others/toggleLike.js";

//------------------------ Subscriptions -------------------------------------
import watchNewPosts from "../../controllers/Subscriptions/post/watchNewPosts.js";

const postResolvers = {
  Query: {
    readPost
  },
  Mutation: {
    createPost,
    toggleLike
  },
  Subscription: {
    watchNewPosts: {
      subscribe: watchNewPosts,
    }
  }
}

export default postResolvers