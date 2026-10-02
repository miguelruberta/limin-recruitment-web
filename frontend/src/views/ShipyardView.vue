<script setup>
import MasterDataTable from '@/components/MasterDataTable.vue';

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'country', label: 'Negara' },
  { key: 'contact', label: 'Kontak' },
  { key: 'actions', label: 'Aksi' },
];

const fields = [
  { name: 'name', label: 'Nama', required: true },
  { name: 'country', label: 'Negara' },
  { name: 'contact', label: 'Kontak' },
];
</script>

<template>
  <MasterDataTable
    resource="shipyards"
    title="Shipyards"
    :columns="columns"
    :fields="fields"
    empty-title="Belum ada shipyard"
  />
</template>