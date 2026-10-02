import Router from 'express';
import { WRITE_ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { idParams, listQuery } from '../validators/commonSchemas.js';
import * as masterSchemas from '../validators/masterSchemas.js';

export function masterRoutes(container) {
  const router = Router();
  const canWrite = authorize(...WRITE_ROLES);

  router.use(authenticate);

  const resources = [
    {
      path: 'shipyards',
      controller: container.shipyardController,
      schemas: masterSchemas.shipyard,
    },
    {
      path: 'companies',
      controller: container.companyController,
      schemas: masterSchemas.company,
    },
    {
      path: 'suppliers',
      controller: container.supplierController,
      schemas: masterSchemas.supplier,
    },
    {
      path: 'vessels',
      controller: container.vesselController,
      schemas: masterSchemas.vessel,
    },
    {
      path: 'specification-groups',
      controller: container.specificationGroupController,
      schemas: masterSchemas.specificationGroup,
    },
    {
      path: 'purchase-order-categories',
      controller: container.purchaseOrderCategoryController,
      schemas: masterSchemas.purchaseOrderCategory,
    },
  ];

  for (const resource of resources) {
    router.get(`/${resource.path}`, validate({ query: listQuery() }), resource.controller.index);
    router.post(
      `/${resource.path}`,
      canWrite,
      validate(resource.schemas.create),
      resource.controller.store,
    );
    router.get(`/${resource.path}/:id`, validate({ params: idParams }), resource.controller.show);
    router.put(
      `/${resource.path}/:id`,
      canWrite,
      validate(resource.schemas.update),
      resource.controller.update,
    );
    router.delete(
      `/${resource.path}/:id`,
      canWrite,
      validate({ params: idParams }),
      resource.controller.destroy,
    );
  }

  return router;
}