import Joi from "joi";

export const createBodyValidation = Joi.object({
  folderId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  imagePosition: Joi.number().required(),
  imageClass: Joi.string().valid('no', 'entrance-half').required()
});

export const updateBodyValidation = Joi.object({
    folderId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/),
    imageClass: Joi.string().optional(),
    imagePosition: Joi.number().integer().min(1).optional()
});

export const deleteBodyValidation = {
  params: Joi.object({
    bodyId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid Body ID format",
        "string.empty": "Body ID is required"
      }),
  }),
};