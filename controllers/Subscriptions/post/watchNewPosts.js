import { pubsub } from '../../../config/redis.js';
import { withFilter } from 'graphql-subscriptions';

import { generateError } from '../../../utils/helpers.js';
const POST_CREATED = 'POST_CREATED';

export default async (
  _,
  __,
  context
) => {
  const auth = context?.user
  const language = context.headers?.language || 'en'
  if (!auth) return generateError('unauthorized', language);

  return withFilter(
    () => pubsub.asyncIterator(POST_CREATED),
    async (payload, __, ___) => { return true } //I can use payload later to send notification to Friends only
  )(_, __, { auth, language });
};
