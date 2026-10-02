<script setup>
import { onMounted, ref } from 'vue';
import DataTable from '@/components/DataTable.vue';
import StatCard from '@/components/StatCard.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { DashboardApi } from '@/services/DashboardApi.js';
import { apiClient } from '@/services/api.js';

const dashboardApi = new DashboardApi(apiClient);

const summary = ref(null);
const upcoming = ref([]);
const loading = ref(true);
const error = ref('');

const columns = [
  { key: 'dryDockNo', label: 'No. Dry Dock' },
  { key: 'vesselName', label: 'Kapal' },
  { key: 'plannedStartDate', label: 'Rencana Mulai' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Prioritas' },
];

onMounted(async () => {
  try {
    const [summaryData, upcomingData] = await Promise.all([
      dashboardApi.summary(),
      dashboardApi.upcoming(),
    ]);
    summary.value = summaryData;
    upcoming.value = upcomingData;
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="dashboard">
    <h1 class="dashboard__title">Dashboard</h1>
    <p v-if="error" class="text-danger">{{ error }}</p>

    <div v-if="summary" class="dashboard__stats">
      <StatCard
        v-for="entry in summary.byStatus"
        :key="entry.status"
        :label="entry.status"
        :value="entry.total"
      />
      <StatCard label="Total Budget" :value="summary.totalBudget" />
      <StatCard label="Total Costs" :value="summary.totalCosts" />
      <StatCard
        label="Variance"
        :value="summary.variance"
        :variant="summary.variance > 0 ? 'danger' : 'success'"
      />
    </div>

    <h2 class="dashboard__subtitle">Upcoming Dry Docks</h2>
    <DataTable
      :columns="columns"
      :rows="upcoming"
      :loading="loading"
      empty-title="Belum ada dry dock mendatang"
    >
      <template #cell-status="{ value }">
        <StatusBadge :status="value" />
      </template>
      <template #cell-priority="{ value }">
        <StatusBadge :status="value" />
      </template>
    </DataTable>
  </section>
</template>

<style scoped>
.dashboard__title {
  font-size: var(--font-xl);
  margin-bottom: var(--space-4);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.dashboard__subtitle {
  font-size: var(--font-lg);
  margin-bottom: var(--space-3);
}
</style>