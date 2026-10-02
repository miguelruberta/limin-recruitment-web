import Joi from 'joi';
import { TASK_STATUS } from '../config/constants.js';
import { id, idParams, listQuery, optionalId } from './commonSchemas.js';

const isoDate = Joi.date().iso().allow(null, '');

export const list = {
  params: idParams,
  query: listQuery({ status: Joi.string().valid(...Object.values(TASK_STATUS)) }),
};

export const create = {
  params: idParams,
  body: Joi.object({
    title: Joi.string().trim().min(1).max(255).required(),
    assigneeId: optionalId,
    dueDate: isoDate,
    status: Joi.string().valid(...Object.values(TASK_STATUS)).default(TASK_STATUS.TODO),
  }),
};

export const update = {
  params: idParams,
  body: Joi.object({
    title: Joi.string().trim().min(1).max(255),
    assigneeId: optionalId,
    dueDate: isoDate,
    status: Joi.string().valid(...Object.values(TASK_STATUS)),
  }),
};

export const remove = {
  params: Joi.object({ id: id.required(), taskId: id.required() }),
};