import { pool } from './config/database.js';
import { MASTER_FIELDS } from './config/masterEntities.js';
import { AttachmentController } from './controllers/AttachmentController.js';
import { AuthController } from './controllers/AuthController.js';
import { ChecklistItemController } from './controllers/ChecklistItemController.js';
import { CrudController } from './controllers/CrudController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { DryDockController } from './controllers/DryDockController.js';
import { EquipmentController } from './controllers/EquipmentController.js';
import { PurchaseOrderController } from './controllers/PurchaseOrderController.js';
import { TaskController } from './controllers/TaskController.js';
import { UserController } from './controllers/UserController.js';
import { WorkOrderController } from './controllers/WorkOrderController.js';
import { AuditLogRepository } from './repositories/AuditLogRepository.js';
import { ChecklistItemRepository } from './repositories/ChecklistItemRepository.js';
import { CompanyRepository } from './repositories/CompanyRepository.js';
import { DryDockAttachmentRepository } from './repositories/DryDockAttachmentRepository.js';
import { DryDockRepository } from './repositories/DryDockRepository.js';
import { EquipmentRepository } from './repositories/EquipmentRepository.js';
import { PurchaseOrderCategoryRepository } from './repositories/PurchaseOrderCategoryRepository.js';
import { PurchaseOrderRepository } from './repositories/PurchaseOrderRepository.js';
import { RefreshTokenRepository } from './repositories/RefreshTokenRepository.js';
import { ShipyardRepository } from './repositories/ShipyardRepository.js';
import { SpecificationGroupRepository } from './repositories/SpecificationGroupRepository.js';
import { SupplierRepository } from './repositories/SupplierRepository.js';
import { TaskRepository } from './repositories/TaskRepository.js';
import { UserRepository } from './repositories/UserRepository.js';
import { VesselRepository } from './repositories/VesselRepository.js';
import { WorkOrderAttachmentRepository } from './repositories/WorkOrderAttachmentRepository.js';
import { WorkOrderMasterRepository } from './repositories/WorkOrderMasterRepository.js';
import { WorkOrderRepository } from './repositories/WorkOrderRepository.js';
import { YardStayLogRepository } from './repositories/YardStayLogRepository.js';
import { AttachmentService } from './services/AttachmentService.js';
import { AuthService } from './services/AuthService.js';
import { CrudService } from './services/CrudService.js';
import { DashboardService } from './services/DashboardService.js';
import { DryDockService } from './services/DryDockService.js';
import { EquipmentService } from './services/EquipmentService.js';
import { PurchaseOrderService } from './services/PurchaseOrderService.js';
import { TaskService } from './services/TaskService.js';
import { UserService } from './services/UserService.js';
import { WorkOrderMasterService } from './services/WorkOrderMasterService.js';
import { WorkOrderService } from './services/WorkOrderService.js';

export function createContainer(db = pool) {
  const repositories = {
    userRepository: new UserRepository(db),
    refreshTokenRepository: new RefreshTokenRepository(db),
    companyRepository: new CompanyRepository(db),
    vesselRepository: new VesselRepository(db),
    shipyardRepository: new ShipyardRepository(db),
    dryDockRepository: new DryDockRepository(db),
    yardStayLogRepository: new YardStayLogRepository(db),
    dryDockAttachmentRepository: new DryDockAttachmentRepository(db),
    specificationGroupRepository: new SpecificationGroupRepository(db),
    equipmentRepository: new EquipmentRepository(db),
    workOrderMasterRepository: new WorkOrderMasterRepository(db),
    checklistItemRepository: new ChecklistItemRepository(db),
    workOrderRepository: new WorkOrderRepository(db),
    workOrderAttachmentRepository: new WorkOrderAttachmentRepository(db),
    supplierRepository: new SupplierRepository(db),
    purchaseOrderCategoryRepository: new PurchaseOrderCategoryRepository(db),
    purchaseOrderRepository: new PurchaseOrderRepository(db),
    taskRepository: new TaskRepository(db),
    auditLogRepository: new AuditLogRepository(db),
  };

  const services = {
    authService: new AuthService(repositories),
    dryDockService: new DryDockService(repositories),
    workOrderService: new WorkOrderService(repositories),
    purchaseOrderService: new PurchaseOrderService(repositories),
    taskService: new TaskService(repositories),
    attachmentService: new AttachmentService(repositories),
    dashboardService: new DashboardService(repositories),
    userService: new UserService(repositories),
    shipyardService: new CrudService({
      repository: repositories.shipyardRepository,
      fields: MASTER_FIELDS.shipyard,
    }),
    companyService: new CrudService({
      repository: repositories.companyRepository,
      fields: MASTER_FIELDS.company,
    }),
    supplierService: new CrudService({
      repository: repositories.supplierRepository,
      fields: MASTER_FIELDS.supplier,
    }),
    vesselService: new CrudService({
      repository: repositories.vesselRepository,
      fields: MASTER_FIELDS.vessel,
    }),
    equipmentService: new EquipmentService({
      repository: repositories.equipmentRepository,
      fields: MASTER_FIELDS.equipment,
    }),
    specificationGroupService: new CrudService({
      repository: repositories.specificationGroupRepository,
      fields: MASTER_FIELDS.specificationGroup,
    }),
    workOrderMasterService: new WorkOrderMasterService({
      repository: repositories.workOrderMasterRepository,
      fields: MASTER_FIELDS.workOrderMaster,
    }),
    purchaseOrderCategoryService: new CrudService({
      repository: repositories.purchaseOrderCategoryRepository,
      fields: MASTER_FIELDS.purchaseOrderCategory,
    }),
  };

  const controllers = {
    authController: new AuthController(services),
    dryDockController: new DryDockController(services),
    workOrderController: new WorkOrderController(services),
    purchaseOrderController: new PurchaseOrderController(services),
    taskController: new TaskController(services),
    attachmentController: new AttachmentController(services),
    dashboardController: new DashboardController(services),
    userController: new UserController(services),
    equipmentController: new EquipmentController({
      crudService: services.equipmentService,
    }),
    checklistItemController: new ChecklistItemController(repositories),
    shipyardController: new CrudController({ crudService: services.shipyardService }),
    companyController: new CrudController({ crudService: services.companyService }),
    supplierController: new CrudController({ crudService: services.supplierService }),
    vesselController: new CrudController({ crudService: services.vesselService }),
    specificationGroupController: new CrudController({
      crudService: services.specificationGroupService,
    }),
    workOrderMasterController: new CrudController({
      crudService: services.workOrderMasterService,
    }),
    purchaseOrderCategoryController: new CrudController({
      crudService: services.purchaseOrderCategoryService,
    }),
  };

  return { db, ...repositories, ...services, ...controllers };
}