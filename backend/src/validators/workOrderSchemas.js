import Joi from 'joi';
import { WORK_ORDER_STATUS } from '../config/constants.js';
import { idParams, money, optionalId, id } from './commonSchemas.js';

export const show = { params: idParams };

export const update = {
  params: idParams,
  body: Joi.object({
    specificationGroupId: id,
    workOrderMasterId: optionalId,
    equipmentId: optionalId,
    title: Joi.string().trim().min(1).max(255),
    description: Joi.string().trim().max(5000).allow('', null),
    estimatedCost: money,
    budgetCost: money,
    actualCost: money,
  }),
};

export const changeStatus = {
  params: idParams,
  body: Joi.object({
    status: Joi.string().valid(...Object.values(WORK_ORDER_STATUS)).required(),
  }),
};

export const uploadImage = { params: idParams };

export const uploadAttachment = { params: idParams };

export const removeAttachment = {
  params: Joi.object({ id: id.required(), attachmentId: id.required() }),
};