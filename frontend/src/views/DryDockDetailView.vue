<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import BarChart from '@/components/BarChart.vue';
import DataTable from '@/components/DataTable.vue';
import DonutChart from '@/components/DonutChart.vue';
import InfoGrid from '@/components/InfoGrid.vue';
import PageTabs from '@/components/PageTabs.vue';
import SearchInput from '@/components/SearchInput.vue';
import SelectField from '@/components/SelectField.vue';
import StatCard from '@/components/StatCard.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { MasterApi } from '@/services/MasterApi.js';
import { apiClient } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.js';
import { useDryDockStore } from '@/stores/dryDock.js';
import { useToast } from '@/composables/useToast.js';

const props = defineProps({ id: { type: [String, Number], required: true } });

const store = useDryDockStore();
const auth = useAuthStore();
const toast = useToast();
const masterApi = new MasterApi(apiClient);

const tabs = [
  { name: 'general', label: 'General' },
  { name: 'specifications', label: 'Specifications' },
  { name: 'tasks', label: 'Tasks' },
  { name: 'reporting', label: 'Reporting' },
  { name: 'costs', label: 'Costs' },
  { name: 'purchase-orders', label: 'Purchase Orders' },
];

const activeTab = ref('general');
const shipyards = ref([]);
const selectedShipyardId = ref(null);
const starting = ref(false);

const workOrderColumns = [
  { key: 'title', label: 'Work Order' },
  { key: 'status', label: 'Status' },
  { key: 'budgetCost', label: 'Budget' },
  { key: 'actualCost', label: 'Biaya' },
];

const taskColumns = [
  { key: 'title', label: 'Task' },
  { key: 'status', label: 'Status' },
  { key: 'dueDate', label: 'Jatuh Tempo' },
];

const poColumns = [
  { key: 'poNumber', label: 'No. PO' },
  { key: 'category', label: 'Kategori' },
  { key: 'totalUsd', label: 'Total' },
  { key: 'status', label: 'Status' },
];

const generalItems = computed(() => {
  const dryDock = store.current;
  if (!dryDock) return [];
  return [
    { key: 'dryDockNo', label: 'Dry Dock No', value: dryDock.dryDockNo },
    { key: 'description', label: 'Description', value: dryDock.description },
    { key: 'company', label: 'Company', value: dryDock.company },
    { key: 'accountCode', label: 'Account Code', value: dryDock.accountCode },
    { key: 'responsibleRank', label: 'Responsible Rank', value: dryDock.responsibleRank },
    { key: 'budget', label: 'Budget', value: `${dryDock.currency} ${dryDock.budget}` },
    { key: 'plannedStart', label: 'Planned Start', value: dryDock.dates.plannedStart },
    { key: 'plannedEnd', label: 'Planned End', value: dryDock.dates.plannedEnd },
    { key: 'actualStart', label: 'Actual Start', value: dryDock.dates.actualStart },
    { key: 'actualEnd', label: 'Actual End', value: dryDock.dates.actualEnd },
    { key: 'priority', label: 'Priority', value: dryDock.priority },
    { key: 'status', label: 'Status', value: dryDock.status },
  ];
});

const comparisonChart = computed(() => ({
  labels: store.charts.comparison.map((row) => row.name),
  datasets: [
    {
      label: 'Budget',
      data: store.charts.comparison.map((row) => row.totalBudget),
      backgroundColor: 'var(--chart-blue)',
    },
    {
      label: 'Estimates',
      data: store.charts.comparison.map((row) => row.totalEstimates),
      backgroundColor: 'var(--chart-gold)',
    },
    {
      label: 'Costs',
      data: store.charts.comparison.map((row) => row.totalCosts),
      backgroundColor: 'var(--chart-green)',
    },
  ],
}));

async function loadTab(tab) {
  if (tab === 'specifications') await store.fetchSpecification(props.id).catch(() => undefined);
  if (tab === 'tasks') await store.fetchTasks(props.id).catch(() => undefined);
  if (tab === 'purchase-orders') {
    await store.fetchPurchaseOrders(props.id).catch(() => undefined);
  }
}

async function applyShipyard() {
  try {
    await store.selectShipyard(props.id, selectedShipyardId.value);
    toast.success('Shipyard disimpan');
  } catch (error) {
    toast.error(error.message);
  }
}

async function onStart() {
  starting.value = true;
  try {
    await store.start(props.id);
    toast.success('Dry dock dimulai');
  } catch (error) {
    toast.error(error.message);
  } finally {
    starting.value = false;
  }
}

watch(activeTab, loadTab);

onMounted(async () => {
  await store.fetchDetail(props.id).catch((error) => toast.error(error.message));
  selectedShipyardId.value = store.current?.shipyard?.id ?? null;
  await Promise.all([
    store.fetchCostSummary(props.id),
    store.fetchCharts(props.id),
  ]).catch(() => undefined);

  try {
    const result = await masterApi.list('shipyards');
    shipyards.value = (result?.data ?? result ?? []).map((item) => ({
      value: item.id,
      label: item.name,
    }));
  } catch {
    shipyards.value = [];
  }
});
</script>

<template>
  <section v-if="store.current" class="detail">
    <header class="detail__header">
      <div>
        <h1 class="detail__title">{{ store.current.vessel.name }}</h1>
        <p class="text-muted">{{ store.current.dryDockNo }} — {{ store.current.title }}</p>
      </div>
      <button
        v-if="store.current.actions.canStart"
        type="button"
        class="btn btn--primary"
        :disabled="starting"
        @click="onStart"
      >
        Start Dry Dock
      </button>
    </header>

    <PageTabs v-model="activeTab" :tabs="tabs" />

    <div v-if="activeTab === 'general'" class="card">
      <InfoGrid :items="generalItems" :columns="3">
        <template #value-priority="{ item }">
          <StatusBadge :status="item.value" />
        </template>
        <template #value-status="{ item }">
          <StatusBadge :status="item.value" />
        </template>
      </InfoGrid>

      <div v-if="auth.canWrite" class="detail__shipyard">
        <SelectField
          v-model="selectedShipyardId"
          label="Shipyard"
          :options="shipyards"
          placeholder="No Shipyard Selected"
        />
        <button type="button" class="btn" @click="applyShipyard">Simpan</button>
      </div>
    </div>

    <div v-else-if="activeTab === 'specifications'" class="stack">
      <SearchInput
        v-model="store.filters.search"
        placeholder="Cari work order..."
        @search="store.fetchSpecification(props.id)"
      />
      <p class="text-muted">Versi spesifikasi: {{ store.specification.version }}</p>
      <section v-for="group in store.specification.groups" :key="group.id" class="card">
        <h2 class="group__title">{{ group.name }}</h2>
        <DataTable
          :columns="workOrderColumns"
          :rows="group.items"
          empty-title="Belum ada work order"
        >
          <template #cell-status="{ value }">
            <StatusBadge :status="value" />
          </template>
        </DataTable>
      </section>
    </div>

    <div v-else-if="activeTab === 'tasks'">
      <DataTable
        :columns="taskColumns"
        :rows="store.tasks"
        empty-title="Belum ada task"
      >
        <template #cell-status="{ value }">
          <StatusBadge :status="value" />
        </template>
      </DataTable>
    </div>

    <div v-else-if="activeTab === 'reporting'" class="stack">
      <div class="card">
        <h2 class="group__title">Status Work Order</h2>
        <DonutChart :items="store.charts.status" />
      </div>
      <div class="card">
        <h2 class="group__title">Yard Stay</h2>
        <DonutChart :items="store.charts.yardStay" />
      </div>
      <div class="card">
        <h2 class="group__title">Budget vs Estimates vs Costs</h2>
        <BarChart :labels="comparisonChart.labels" :datasets="comparisonChart.datasets" />
      </div>
    </div>

    <div v-else-if="activeTab === 'costs'" class="stack">
      <div v-if="store.costSummary" class="stats">
        <StatCard label="Budget" :value="store.costSummary.budget" />
        <StatCard label="Total Estimates" :value="store.costSummary.totalEstimates" />
        <StatCard label="Total Costs" :value="store.costSummary.totalCosts" />
        <StatCard
          label="Variance"
          :value="store.costSummary.variance"
          :variant="store.costSummary.variance > 0 ? 'danger' : 'success'"
        />
      </div>
    </div>

    <div v-else class="stack">
      <section v-for="group in store.purchaseOrders" :key="group.id" class="card">
        <h2 class="group__title">{{ group.name }}</h2>
        <DataTable :columns="poColumns" :rows="group.items" empty-title="Belum ada PO">
          <template #cell-category="{ value }">{{ value?.name }}</template>
          <template #cell-status="{ value }">
            <StatusBadge :status="value" />
          </template>
        </DataTable>
      </section>
    </div>
  </section>

  <p v-else-if="store.loading" class="text-muted">Memuat data dry dock...</p>
  <p v-else class="text-danger">{{ store.error || 'Dry dock tidak ditemukan' }}</p>
</template>

<style scoped>
.detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.detail__title {
  font-size: var(--font-xl);
}

.detail__shipyard {
  display: flex;
  align-items: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

.group__title {
  font-size: var(--font-lg);
  margin-bottom: var(--space-3);
}
</style>