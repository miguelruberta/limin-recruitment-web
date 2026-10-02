import Router from 'express';
import { authRoutes } from './authRoutes.js';
import { dashboardRoutes } from './dashboardRoutes.js';
import { dryDockRoutes } from './dryDockRoutes.js';
import { equipmentRoutes } from './equipmentRoutes.js';
import { masterRoutes } from './masterRoutes.js';
import { purchaseOrderRoutes } from './purchaseOrderRoutes.js';
import { userRoutes } from './userRoutes.js';
import { workOrderMasterRoutes } from './workOrderMasterRoutes.js';
import { workOrderRoutes } from './workOrderRoutes.js';

export function apiRoutes(container) {
  const router = Router();

  router.use('/auth', authRoutes(container));
  router.use('/dry-docks', dryDockRoutes(container));
  router.use('/work-orders', workOrderRoutes(container));
  router.use('/purchase-orders', purchaseOrderRoutes(container));
  router.use('/work-order-masters', workOrderMasterRoutes(container));
  router.use('/vessels/:vesselId/equipment', equipmentRoutes(container));
  router.use('/dashboard', dashboardRoutes(container));
  router.use('/users', userRoutes(container));
  router.use(masterRoutes(container));

  return router;
}