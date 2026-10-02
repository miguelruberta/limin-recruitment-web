<script setup>
import { computed, onMounted, ref } from 'vue';
import MasterDataTable from '@/components/MasterDataTable.vue';
import { MasterApi } from '@/services/MasterApi.js';
import { apiClient } from '@/services/api.js';

const columns = [
  { key: 'title', label: 'Judul' },
  { key: 'specificationGroupId', label: 'Specification Group ID' },
  { key: 'description', label: 'Deskripsi' },
  { key: 'actions', label: 'Aksi' },
];

const masterApi = new MasterApi(apiClient);
const groupOptions = ref([]);

const fields = computed(() => [
  { name: 'title', label: 'Judul', required: true },
  {
    name: 'specificationGroupId',
    label: 'Specification Group',
    options: groupOptions.value,
    placeholder: 'Pilih specification group',
    required: true,
  },
  { name: 'description', label: 'Deskripsi' },
]);

onMounted(async () => {
  try {
    const result = await masterApi.list('specification-groups', { limit: 100 });
    groupOptions.value = (result?.data ?? result ?? []).map((item) => ({
      value: item.id,
      label: item.name,
    }));
  } catch {
    groupOptions.value = [];
  }
});
</script>

<template>
  <MasterDataTable
    resource="work-order-masters"
    title="Work Order Master"
    :columns="columns"
    :fields="fields"
    empty-title="Belum ada work order master"
  />
</template>