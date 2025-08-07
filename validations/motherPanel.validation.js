import Joi from 'joi';

export const createMotherPanelValidation = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid userId format'),
  mother_panel: Joi.string().required()
});

// Get User List (with optional pagination)
export const getMotherPanelListValidation = Joi.object({
  _id: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).optional().default(10),
});

export const updateMotherPanelValidation = Joi.object({
  userId: Joi.string().required(),
  mother_panel: Joi.string().required()
});