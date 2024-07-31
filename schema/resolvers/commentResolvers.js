//------------------------ Queries -------------------------------------

//------------------------ Mutations -------------------------------------
import createComment from "../../controllers/mutations/comments/createComment.js";
import deleteComment from "../../controllers/mutations/comments/deleteComment.js";
import toggleLikeComment from "../../controllers/mutations/comments/toggleLikeComment.js";

//------------------------ Subscriptions -------------------------------------
import watchNewComments from "../../controllers/Subscriptions/comment/watchNewComments.js";

const commentResolvers = {
  Mutation: {
    createComment,
    deleteComment,
    toggleLikeComment
  },
  Subscription: {
    watchNewComments: {
      subscribe: watchNewComments,
    }
  }
}

export default commentResolvers