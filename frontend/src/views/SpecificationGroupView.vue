<script setup>
import MasterDataTable from '@/components/MasterDataTable.vue';

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'sortOrder', label: 'Urutan' },
  { key: 'actions', label: 'Aksi' },
];

const fields = [
  { name: 'name', label: 'Nama', required: true },
  { name: 'sortOrder', label: 'Urutan', type: 'number', default: 0 },
];
</script>

<template>
  <MasterDataTable
    resource="specification-groups"
    title="Specification Groups"
    :columns="columns"
    :fields="fields"
    empty-title="Belum ada specification group"
  />
</template>