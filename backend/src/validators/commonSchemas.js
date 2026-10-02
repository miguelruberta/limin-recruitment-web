import Joi from 'joi';
import { PAGINATION } from '../config/constants.js';

export const money = Joi.number().min(0).max(9999999999999.99);
export const id = Joi.number().integer().positive();
export const optionalId = Joi.number().integer().positive().allow(null, '');

export const idParams = Joi.object({ id: id.required() });

export const idWithAttachmentParams = Joi.object({
  id: id.required(),
  attachmentId: id.required(),
});

export const vesselEquipmentParams = Joi.object({ vesselId: id.required() });

export const masterIdParams = Joi.object({ id: id.required() });

export function listQuery(extra = {}) {
  return Joi.object({
    page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
    limit: Joi.number().integer().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
    search: Joi.string().trim().max(120).allow(''),
    sort: Joi.string().trim().max(60).allow(''),
    ...extra,
  });
}

export const sortByEnum = (...values) => Joi.string().valid(...values);