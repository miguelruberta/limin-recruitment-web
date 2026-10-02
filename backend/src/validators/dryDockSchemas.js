import Joi from 'joi';
import { DRY_DOCK_STATUS, PRIORITY, WORK_ORDER_STATUS } from '../config/constants.js';
import { id, idParams, listQuery, money, optionalId } from './commonSchemas.js';

const isoDate = Joi.date().iso().allow(null, '');

const editableFields = {
  dryDockNo: Joi.string().trim().min(1).max(50),
  vesselId: id,
  shipyardId: optionalId,
  title: Joi.string().trim().min(1).max(190),
  description: Joi.string().trim().max(5000).allow('', null),
  accountCode: Joi.string().trim().max(50).allow('', null),
  responsibleRank: Joi.string().trim().max(100).allow('', null),
  currency: Joi.string().trim().uppercase().length(3),
  budget: money,
  yardEstimates: money,
  ownerEstimates: money,
  actualYardCosts: money,
  actualOwnerCosts: money,
  priority: Joi.string().valid(...Object.values(PRIORITY)),
  plannedStartDate: isoDate,
  plannedEndDate: isoDate,
  actualStartDate: isoDate,
  actualEndDate: isoDate,
};

const workOrderFields = {
  specificationGroupId: id,
  workOrderMasterId: optionalId,
  equipmentId: optionalId,
  title: Joi.string().trim().min(1).max(255),
  description: Joi.string().trim().max(5000).allow('', null),
  estimatedCost: money.default(0),
  budgetCost: money.default(0),
  actualCost: money.default(0),
  status: Joi.string().valid(...Object.values(WORK_ORDER_STATUS)),
};

export const list = {
  query: listQuery({
    status: Joi.string().valid(...Object.values(DRY_DOCK_STATUS)),
    priority: Joi.string().valid(...Object.values(PRIORITY)),
    vessel_id: id,
    vesselId: id,
    shipyard_id: id,
    shipyardId: id,
  }),
};

export const create = {
  body: Joi.object({
    ...editableFields,
    dryDockNo: editableFields.dryDockNo.required(),
    vesselId: id.required(),
    title: editableFields.title.required(),
    status: Joi.string().valid(...Object.values(DRY_DOCK_STATUS)),
  }),
};

export const show = { params: idParams };

export const update = {
  params: idParams,
  body: Joi.object(editableFields),
};

export const remove = { params: idParams };

export const selectShipyard = {
  params: idParams,
  body: Joi.object({ shipyardId: optionalId.required() }),
};

export const changePriority = {
  params: idParams,
  body: Joi.object({ priority: Joi.string().valid(...Object.values(PRIORITY)).required() }),
};

export const changeStatus = {
  params: idParams,
  body: Joi.object({ status: Joi.string().valid(...Object.values(DRY_DOCK_STATUS)).required() }),
};

export const createWorkOrder = {
  params: idParams,
  body: Joi.object({
    ...workOrderFields,
    specificationGroupId: workOrderFields.specificationGroupId.required(),
    title: workOrderFields.title.required(),
  }),
};

export const specifications = {
  params: idParams,
  query: Joi.object({ search: Joi.string().trim().max(120).allow('') }),
};