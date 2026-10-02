import Joi from 'joi';
import { PASSWORD_MIN_LENGTH, ROLES } from '../config/constants.js';
import { idParams, listQuery } from './commonSchemas.js';

const password = Joi.string().min(PASSWORD_MIN_LENGTH).max(128).required();
const email = Joi.string().trim().lowercase().email().max(190);
const role = Joi.string().valid(...Object.values(ROLES));

export const list = {
  query: listQuery({
    role,
    is_active: Joi.boolean(),
  }),
};

export const create = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(120).required(),
    email: email.required(),
    password,
    role: role.default(ROLES.VIEWER),
  }),
};

export const update = {
  params: idParams,
  body: Joi.object({
    name: Joi.string().trim().min(1).max(120),
    email,
    password: Joi.string().min(PASSWORD_MIN_LENGTH).max(128),
    role,
    isActive: Joi.boolean(),
  }),
};