import { GraphQLError } from 'graphql';
import errorMessages from '../data/errorMessages.js';
import successMessages from '../data/successMessages.js';


export function mutationFailResponse(error) {
  return {
    code: !error.extensions ? 500 : (error.extensions.code),
    success: false,
    message: !error.extensions ? error.message : (error.extensions.error),
    helperMessage: error.message,
    data: null,
    token: null,
  };
};

export function mutationSuccessResponse(key, language, data) {
  if (!language) language = 'en';

  const isExistingKey = successMessages[key]?.[language];
  if (!isExistingKey) key = 'error';
  return {
    code: successMessages[key]?.code,
    success: successMessages[key]?.success,
    message: successMessages[key]?.[language],
    data,
  };
};

export function generateError(key, language) {
  if (!language) language = 'en';

  const isExistingKey = errorMessages[key]?.[language];
  if (!isExistingKey) key = 'error';

  throw new GraphQLError(errorMessages[key], {
    extensions: {
      code: errorMessages[key]?.code,
      error: errorMessages[key]?.[language],
    },
  });
};
