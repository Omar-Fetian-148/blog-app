import Joi from 'joi';

const validateComment = Joi.object({
  body: Joi.string().min(3).required().messages({
    'string.empty': 'Body cannot be empty',
    'string.email': 'Body must be a valid email',
    'any.required': 'Body is required',
  }),

  postId: Joi.string().required().messages({
    'string.empty': 'postId cannot be empty',
    'any.required': 'postId is required',
  }),
});

export default validateComment;
