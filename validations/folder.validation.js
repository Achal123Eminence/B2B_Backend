import Joi from "joi";

export const createFolderValidation = Joi.object({
    panelId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    folder_name: Joi.string().allow('').optional(),
    image_url: Joi.string().allow('').optional()
});

export const getFolderListValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).optional().default(10),
});

export const updateFolderValidation = Joi.object({
  panelId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  folder_name: Joi.string().allow('').optional(),
  image_url: Joi.string().allow('').optional()
});