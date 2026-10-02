export const MASTER_FIELDS = Object.freeze({
  shipyard: { id: 'id', name: 'name', country: 'country', contact: 'contact', createdAt: 'created_at', updatedAt: 'updated_at' },
  company: { id: 'id', name: 'name', createdAt: 'created_at', updatedAt: 'updated_at' },
  supplier: { id: 'id', name: 'name', createdAt: 'created_at' },
  vessel: {
    id: 'id',
    companyId: 'company_id',
    name: 'name',
    imoNumber: 'imo_number',
    imageUrl: 'image_path',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  equipment: { id: 'id', vesselId: 'vessel_id', code: 'code', name: 'name', createdAt: 'created_at' },
  specificationGroup: { id: 'id', name: 'name', sortOrder: 'sort_order', createdAt: 'created_at', updatedAt: 'updated_at' },
  workOrderMaster: {
    id: 'id',
    specificationGroupId: 'specification_group_id',
    title: 'title',
    description: 'description',
    checklistItems: 'checklist_items',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  purchaseOrderCategory: { id: 'id', name: 'name' },
});

export const MASTER_LABELS = Object.freeze({
  shipyard: 'Shipyard',
  company: 'Perusahaan',
  supplier: 'Supplier',
  vessel: 'Kapal',
  equipment: 'Peralatan',
  specificationGroup: 'Specification group',
  workOrderMaster: 'Work order master',
  purchaseOrderCategory: 'Kategori purchase order',
});