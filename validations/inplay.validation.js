import Joi from 'joi';

export const addOrUpdateInplayValidation = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  panelDetailsId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  cricket_variant: Joi.string().allow('').optional(),
  virtual_variant: Joi.string().allow('').optional(),
  football_variant: Joi.string().allow('').optional(),
  tennis_variant: Joi.string().allow('').optional(),
});