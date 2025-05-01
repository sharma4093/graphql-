import Joi from 'joi';
import { ValidationError } from './error.js';


export const validate = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
  
  if (error) {
    const errorDetails = error.details.map((detail) => ({
      path: detail.path.join('.'),
      message: detail.message,
    }));
    
    throw new ValidationError('Validation error', errorDetails);
  }
  
  return value;
};

// User schemas
export const userSchemas = {
  // User creation schema
  createUser: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    email: Joi.string().required().email().lowercase().trim(),
    password: Joi.string().required().min(6).max(15).message("6<=password<=15 digits "),
  }),
  
  // User login schema
  loginUser: Joi.object({
    email: Joi.string().required().email().lowercase().trim(),
    password: Joi.string().required(),
  }),
  
  // User update schema
  updateUser: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    role: Joi.number().optional(),
    isActive: Joi.boolean()
  }).min(1),
};

// Book schemas
export const bookSchemas = {
  // Create book schema
  createBook: Joi.object({
    book_name: Joi.string().required().trim().min(1).max(200),
    author: Joi.string().required().trim().min(1).max(100),
  }),
  
  // Update book schema
  updateBook: Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    book_name: Joi.string().trim().min(1).max(200),
    author: Joi.string().trim().min(1).max(100),
  }),
  
  // Book booking schema
  bookingBook: Joi.object({
    book_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    user_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    from_time: Joi.date().required().greater('now'),
    end_time: Joi.date().required().greater(Joi.ref('from_time')),
  }),
}; 