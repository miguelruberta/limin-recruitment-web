import Joi from 'joi';
import { id, idParams, vesselEquipmentParams } from './commonSchemas.js';

const name = (max) => Joi.string().trim().min(1).max(max);

export const shipyard = {
  create: {
    body: Joi.object({
      name: name(150).required(),
      country: Joi.string().trim().max(80).allow('', null),
      contact: Joi.string().trim().max(190).allow('', null),
    }),
  },
  update: {
    params: idParams,
    body: Joi.object({
      name: name(150),
      country: Joi.string().trim().max(80).allow('', null),
      contact: Joi.string().trim().max(190).allow('', null),
    }),
  },
};

export const specificationGroup = {
  create: {
    body: Joi.object({
      name: name(150).required(),
      sortOrder: Joi.number().integer().default(0),
    }),
  },
  update: {
    params: idParams,
    body: Joi.object({
      name: name(150),
      sortOrder: Joi.number().integer(),
    }),
  },
};

export const supplier = {
  create: { body: Joi.object({ name: name(190).required() }) },
  update: { params: idParams, body: Joi.object({ name: name(190) }) },
};

export const purchaseOrderCategory = {
  create: { body: Joi.object({ name: name(80).required() }) },
  update: { params: idParams, body: Joi.object({ name: name(80) }) },
};

export const company = {
  create: { body: Joi.object({ name: name(150).required() }) },
  update: { params: idParams, body: Joi.object({ name: name(150) }) },
};

export const vessel = {
  create: {
    body: Joi.object({
      companyId: id.required(),
      name: name(150).required(),
      imoNumber: Joi.string().trim().max(20).allow('', null),
    }),
  },
  update: {
    params: idParams,
    body: Joi.object({
      companyId: id,
      name: name(150),
      imoNumber: Joi.string().trim().max(20).allow('', null),
    }),
  },
};

export const equipment = {
  list: {
    params: vesselEquipmentParams,
  },
  create: {
    params: vesselEquipmentParams,
    body: Joi.object({
      code: Joi.string().trim().min(1).max(50).required(),
      name: name(190).required(),
    }),
  },
  update: {
    params: idParams,
    body: Joi.object({
      code: Joi.string().trim().min(1).max(50),
      name: name(190),
    }),
  },
};

export const workOrderMaster = {
  create: {
    body: Joi.object({
      specificationGroupId: id.required(),
      title: name(255).required(),
      description: Joi.string().trim().max(5000).allow('', null),
    }),
  },
  update: {
    params: idParams,
    body: Joi.object({
      specificationGroupId: id,
      title: name(255),
      description: Joi.string().trim().max(5000).allow('', null),
    }),
  },
};

export const checklistItem = {
  list: { params: Joi.object({ id: id.required() }) },
  create: {
    params: Joi.object({ id: id.required() }),
    body: Joi.object({
      label: name(255).required(),
      sortOrder: Joi.number().integer().default(0),
    }),
  },
  update: {
    params: Joi.object({ id: id.required(), itemId: id.required() }),
    body: Joi.object({
      label: name(255),
      sortOrder: Joi.number().integer(),
    }),
  },
  remove: {
    params: Joi.object({ id: id.required(), itemId: id.required() }),
  },
};