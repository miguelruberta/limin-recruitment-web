<script setup>
import EmptyState from './EmptyState.vue';

defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  emptyTitle: { type: String, default: 'Belum ada data' },
  emptyDescription: { type: String, default: '' },
});
</script>

<template>
  <div class="card">
    <p v-if="loading" class="text-muted">Memuat data...</p>
    <EmptyState
      v-else-if="rows.length === 0"
      :title="emptyTitle"
      :description="emptyDescription"
    />
    <table v-else class="table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="row.id ?? index">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] ?? '-' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>