<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import DataTable from '@/components/DataTable.vue';
import SearchInput from '@/components/SearchInput.vue';
import SelectField from '@/components/SelectField.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { useDryDockStore } from '@/stores/dryDock.js';

const store = useDryDockStore();

const columns = [
  { key: 'dryDockNo', label: 'No. Dry Dock' },
  { key: 'vesselName', label: 'Kapal' },
  { key: 'shipyardName', label: 'Shipyard' },
  { key: 'budget', label: 'Budget' },
  { key: 'priority', label: 'Prioritas' },
  { key: 'status', label: 'Status' },
];

const statusOptions = [
  { value: 'PLANNING', label: 'Planning' },
  { value: 'EXECUTION', label: 'Execution' },
  { value: 'COMPLETED', label: 'Completed' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

async function refresh() {
  await store.fetchList().catch(() => undefined);
}

function formatCurrency(value, currency) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: store.filters.currency ?? currency ?? 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

onMounted(refresh);
</script>

<template>
  <section class="dry-docks">
    <h1 class="dry-docks__title">Dry Docks</h1>

    <div class="dry-docks__toolbar">
      <SearchInput
        v-model="store.filters.search"
        placeholder="Cari dry dock..."
        @search="refresh"
      />
      <SelectField
        :model-value="store.filters.status"
        label="Status"
        :options="statusOptions"
        placeholder="Semua status"
        @update:model-value="store.setFilter('status', $event); refresh()"
      />
      <SelectField
        :model-value="store.filters.priority"
        label="Prioritas"
        :options="priorityOptions"
        placeholder="Semua prioritas"
        @update:model-value="store.setFilter('priority', $event); refresh()"
      />
    </div>

    <p v-if="store.error" class="text-danger">{{ store.error }}</p>

    <DataTable
      :columns="columns"
      :rows="store.items"
      :loading="store.loading"
      empty-title="Belum ada dry dock"
      empty-description="Buat dry dock pertama untuk memulai"
    >
      <template #cell-dryDockNo="{ row }">
        <RouterLink :to="{ name: 'dry-dock-detail', params: { id: row.id } }">
          {{ row.dryDockNo }}
        </RouterLink>
      </template>
      <template #cell-budget="{ row }">
        {{ formatCurrency(row.budget, row.currency) }}
      </template>
      <template #cell-priority="{ value }">
        <StatusBadge :status="value" />
      </template>
      <template #cell-status="{ value }">
        <StatusBadge :status="value" />
      </template>
    </DataTable>

    <nav class="dry-docks__pagination">
      <button
        type="button"
        class="btn"
        :disabled="store.meta.page <= 1"
        @click="store.goToPage(store.meta.page - 1)"
      >
        Sebelumnya
      </button>
      <span class="text-muted">
        Halaman {{ store.meta.page }} dari {{ store.meta.totalPages }}
      </span>
      <button
        type="button"
        class="btn"
        :disabled="store.meta.page >= store.meta.totalPages"
        @click="store.goToPage(store.meta.page + 1)"
      >
        Berikutnya
      </button>
    </nav>
  </section>
</template>

<style scoped>
.dry-docks__title {
  font-size: var(--font-xl);
  margin-bottom: var(--space-4);
}

.dry-docks__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: flex-end;
  margin-bottom: var(--space-4);
}

.dry-docks__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-top: var(--space-4);
}
</style>