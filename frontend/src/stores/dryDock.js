import { defineStore } from 'pinia';
import { DryDockApi } from '@/services/DryDockApi.js';
import { DryDock } from '@/models/DryDock.js';
import { DryDockListItem } from '@/models/DryDockListItem.js';
import { CostSummary } from '@/models/CostSummary.js';
import { WorkOrder } from '@/models/WorkOrder.js';
import { apiClient } from '@/services/api.js';

const dryDockApi = new DryDockApi(apiClient);

export const useDryDockStore = defineStore('dryDock', {
  state: () => ({
    items: [],
    meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
    filters: { search: '', status: '', priority: '', page: 1, limit: 20, sort: '-planned_start_date' },
    current: null,
    costSummary: null,
    charts: { status: [], yardStay: [], comparison: [] },
    specification: { version: 0, exportedAt: null, groups: [] },
    purchaseOrders: [],
    tasks: [],
    loading: false,
    error: null,
  }),

  getters: {
    isEmpty: (state) => !state.loading && state.items.length === 0,
  },

  actions: {
    async fetchList() {
      this.loading = true;
      this.error = null;
      try {
        const query = Object.fromEntries(
          Object.entries(this.filters).filter(([, value]) => value !== '' && value !== null),
        );
        const result = await dryDockApi.list(query);
        const rows = result?.data ?? result ?? [];
        const meta = result?.meta ?? this.meta;

        this.items = rows.map(DryDockListItem.fromApi);
        this.meta = meta;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setFilter(key, value) {
      this.filters[key] = value;
      if (key !== 'page') this.filters.page = 1;
    },

    goToPage(page) {
      this.filters.page = page;
      return this.fetchList();
    },

    async fetchDetail(id) {
      this.loading = true;
      this.error = null;
      try {
        this.current = DryDock.fromApi(await dryDockApi.get(id));
        return this.current;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCostSummary(id) {
      this.costSummary = CostSummary.fromApi(await dryDockApi.costSummary(id));
      return this.costSummary;
    },

    async fetchCharts(id) {
      const [status, yardStay, comparison] = await Promise.all([
        dryDockApi.chartStatus(id),
        dryDockApi.chartYardStay(id),
        dryDockApi.chartComparison(id),
      ]);
      this.charts = { status, yardStay, comparison };
    },

    async fetchSpecification(id) {
      const payload = await dryDockApi.specifications(id, this.filters.search);
      this.specification = {
        version: payload.version ?? 0,
        exportedAt: payload.exportedAt ?? null,
        groups: (payload.groups ?? []).map((group) => ({
          ...group,
          items: (group.items ?? []).map(WorkOrder.fromApi),
        })),
      };
      return this.specification;
    },

    async fetchPurchaseOrders(id) {
      this.purchaseOrders = await dryDockApi.purchaseOrders(id, this.filters.search);
      return this.purchaseOrders;
    },

    async fetchTasks(id) {
      const result = await dryDockApi.tasks(id);
      this.tasks = result?.data ?? result ?? [];
      return this.tasks;
    },

    async start(id) {
      this.current = DryDock.fromApi(await dryDockApi.start(id));
      return this.current;
    },

    async selectShipyard(id, shipyardId) {
      this.current = DryDock.fromApi(await dryDockApi.selectShipyard(id, shipyardId));
      return this.current;
    },

    async changeStatus(id, status) {
      this.current = DryDock.fromApi(await dryDockApi.changeStatus(id, status));
      return this.current;
    },

    async changePriority(id, priority) {
      this.current = DryDock.fromApi(await dryDockApi.changePriority(id, priority));
      return this.current;
    },
  },
});