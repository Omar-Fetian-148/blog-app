import { Types } from "mongoose";
import { pubsub } from '../../../config/redis.js';
import { withFilter } from 'graphql-subscriptions';
import { User, Relationship } from "../../../data/models/index.js";
import { generateError } from '../../../utils/helpers.js';
const POST_CREATED = 'POST_CREATED';

export default async (
  _,
  __,
  { user, language = 'en' }
) => {

  if (!user) return generateError('unauthorized', language);
  return withFilter(
    () => pubsub.asyncIterator(POST_CREATED),
    async (payload, __, ___) => {
      const authorId = payload?.watchNewPosts?.data?.userId

      const hasRelation = await Relationship.findOne({
        primaryUserId: new Types.ObjectId(authorId),
        secondaryUserId: new Types.ObjectId(user?._id),
        relationType: 'FOLLOW'
      })
      if (hasRelation) return true
      return false
    } //I can use payload later to send notification to Friends only
  )(_, __, { user, language });
};
