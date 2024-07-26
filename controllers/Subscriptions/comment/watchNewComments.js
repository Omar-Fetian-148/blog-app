import { Types } from "mongoose";
import { pubsub } from '../../../config/redis.js';
import { withFilter } from 'graphql-subscriptions';
import { Post } from "../../../data/models/index.js";
import { generateError } from '../../../utils/helpers.js';
const COMMENT_CREATED = 'COMMENT_CREATED';

export default async (
  _,
  __,
  { user, language = 'en' }
) => {

  if (!user) return generateError('unauthorized', language);

  return withFilter(
    () => pubsub.asyncIterator(COMMENT_CREATED),
    async (payload, __, ___) => {

      const authorId = payload?.watchNewComments?.data?.userId
      const postId = payload?.watchNewComments?.data?.postId

      if (user?._id.toString() === authorId.toString()) return false

      let myPosts = await Post.findById(postId)

      if (myPosts) {
        return true
      } else {
        return false
      }

    }
  )(_, __, { user, language });
};
