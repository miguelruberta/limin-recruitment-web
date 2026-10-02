<script setup>
import MasterDataTable from '@/components/MasterDataTable.vue';

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'actions', label: 'Aksi' },
];

const fields = [{ name: 'name', label: 'Nama', required: true }];
</script>

<template>
  <MasterDataTable
    resource="suppliers"
    title="Suppliers"
    :columns="columns"
    :fields="fields"
    empty-title="Belum ada supplier"
  />
</template>