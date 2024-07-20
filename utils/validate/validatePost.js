import Joi from 'joi';

const validatePost = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'Title cannot be empty',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 30 characters',
    'any.required': 'Title is required',
  }),
  body: Joi.string().min(3).required().messages({
    'string.empty': 'Body cannot be empty',
    'string.email': 'Body must be a valid email',
    'any.required': 'Body is required',
  }),
  category: Joi.string().min(3).max(10).required().messages({
    'string.empty': 'Category cannot be empty',
    'string.min': 'Category must be at least 6 characters long',
    'any.required': 'Category is required',
  }),
});

export default validatePost;
