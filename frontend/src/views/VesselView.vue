<script setup>
import { computed, onMounted, ref } from 'vue';
import MasterDataTable from '@/components/MasterDataTable.vue';
import { MasterApi } from '@/services/MasterApi.js';
import { apiClient } from '@/services/api.js';

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'imoNumber', label: 'IMO Number' },
  { key: 'companyId', label: 'Company ID' },
  { key: 'actions', label: 'Aksi' },
];

const masterApi = new MasterApi(apiClient);
const companyOptions = ref([]);

const fields = computed(() => [
  { name: 'name', label: 'Nama', required: true },
  { name: 'imoNumber', label: 'IMO Number' },
  {
    name: 'companyId',
    label: 'Company',
    options: companyOptions.value,
    placeholder: 'Pilih company',
    required: true,
  },
]);

onMounted(async () => {
  try {
    const result = await masterApi.list('companies', { limit: 100 });
    companyOptions.value = (result?.data ?? result ?? []).map((item) => ({
      value: item.id,
      label: item.name,
    }));
  } catch {
    companyOptions.value = [];
  }
});
</script>

<template>
  <MasterDataTable
    resource="vessels"
    title="Vessels"
    :columns="columns"
    :fields="fields"
    empty-title="Belum ada kapal"
  />
</template>