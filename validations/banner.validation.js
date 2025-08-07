import Joi from "joi";

export const createBannerValidation = Joi.object({
  banner_variant: Joi.string().allow('').optional(),
  image_type: Joi.string().valid('csv', 'image').required()
});