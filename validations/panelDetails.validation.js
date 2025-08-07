import Joi from 'joi';

export const createPanelDetailsValidation = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  panelId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  website_name: Joi.string().required(),
  website_url: Joi.string().uri().required(),
  refresh_endpoint_url: Joi.string().uri().required(),
  website_logo_variant: Joi.string().allow('').optional(),
  website_logo_web_variant: Joi.string().allow('').optional(),
  website_logo_mobile_variant: Joi.string().allow('').optional(),
  website_favicon_variant: Joi.string().allow('').optional(),
});

export const getPanelDetailsValidation = Joi.object({
  panelId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

