//------------------------ Queries -------------------------------------

//------------------------ Mutations -------------------------------------
import createComment from "../../controllers/mutations/comments/createComment.js";
import deleteComment from "../../controllers/mutations/comments/deleteComment.js";

//------------------------ Subscriptions -------------------------------------
import watchNewComments from "../../controllers/Subscriptions/comment/watchNewComments.js";

const commentResolvers = {
  Mutation: {
    createComment,
    deleteComment
  },
  Subscription: {
    watchNewComments: {
      subscribe: watchNewComments,
    }
  }
}

export default commentResolvers