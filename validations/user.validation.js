import Joi from 'joi';

// Login validation
export const loginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// Create User type "user"
export const createUserValidation = Joi.object({
  first_name: Joi.string().optional().allow(""),
  last_name: Joi.string().optional().allow(""),
  cloud_account_id: Joi.string().required(),
  cloud_auth: Joi.string().required(),
  cloud_image_url: Joi.string().uri().required(),
  email: Joi.string().email().optional().allow(""),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(), // this will be hashed before saving
});

// Get User List (with optional pagination)
export const getUserListValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).optional().default(10),
});

// Update User type "user"
export const updateUserValidation = Joi.object({
  first_name: Joi.string().optional().allow(""),
  last_name: Joi.string().optional().allow(""),
  cloud_account_id: Joi.string().optional(),
  cloud_auth: Joi.string().optional(),
  cloud_image_url: Joi.string().uri().optional(),
  email: Joi.string().email().optional().allow(""),
  password: Joi.string().min(6).optional(),
  username: Joi.string().optional(),
});