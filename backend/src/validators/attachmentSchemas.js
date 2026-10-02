import Joi from 'joi';
import { idParams, idWithAttachmentParams } from './commonSchemas.js';

export const list = { params: idParams };

export const upload = {
  params: idParams,
  body: Joi.object({
    title: Joi.string().trim().min(1).max(150).required(),
    includeInSpecs: Joi.boolean().default(false),
  }),
};

export const update = {
  params: idWithAttachmentParams,
  body: Joi.object({ includeInSpecs: Joi.boolean().required() }),
};

export const remove = {
  params: idWithAttachmentParams,
};