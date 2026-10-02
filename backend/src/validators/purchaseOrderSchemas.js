import Joi from 'joi';
import { PURCHASE_ORDER_STATUS } from '../config/constants.js';
import { id, idParams, money, optionalId } from './commonSchemas.js';

const editableFields = {
  categoryId: id,
  supplierId: optionalId,
  poNumber: Joi.string().trim().min(1).max(60),
  totalUsd: money,
  status: Joi.string().valid(...Object.values(PURCHASE_ORDER_STATUS)),
};

export const listByDryDock = {
  params: idParams,
  query: Joi.object({ search: Joi.string().trim().max(120).allow('') }),
};

export const create = {
  params: idParams,
  body: Joi.object({
    ...editableFields,
    categoryId: id.required(),
    poNumber: editableFields.poNumber.required(),
  }),
};

export const update = {
  params: idParams,
  body: Joi.object(editableFields),
};