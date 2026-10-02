<script setup>
import { onMounted, ref, watch } from 'vue';
import DataTable from '@/components/DataTable.vue';
import SelectField from '@/components/SelectField.vue';
import { MasterApi } from '@/services/MasterApi.js';
import { apiClient } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from '@/composables/useToast.js';

const masterApi = new MasterApi(apiClient);
const auth = useAuthStore();
const toast = useToast();

const columns = [
  { key: 'label', label: 'Label' },
  { key: 'sortOrder', label: 'Urutan' },
  { key: 'actions', label: 'Aksi' },
];

const masterOptions = ref([]);
const selectedMasterId = ref(null);
const items = ref([]);
const loading = ref(false);
const newLabel = ref('');
const newSortOrder = ref(0);
const saving = ref(false);

async function fetchMasters() {
  try {
    const result = await masterApi.list('work-order-masters', { limit: 100 });
    masterOptions.value = (result?.data ?? result ?? []).map((item) => ({
      value: item.id,
      label: item.title,
    }));
  } catch (error) {
    toast.error(error.message);
  }
}

async function fetchItems() {
  if (!selectedMasterId.value) {
    items.value = [];
    return;
  }

  loading.value = true;
  try {
    items.value = await masterApi.listChecklistItems(selectedMasterId.value);
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
}

async function onAdd() {
  if (!selectedMasterId.value || !newLabel.value.trim()) return;
  saving.value = true;
  try {
    await masterApi.createChecklistItem(selectedMasterId.value, {
      label: newLabel.value.trim(),
      sortOrder: Number(newSortOrder.value) || 0,
    });
    newLabel.value = '';
    newSortOrder.value = 0;
    await fetchItems();
    toast.success('Checklist item ditambahkan');
  } catch (error) {
    toast.error(error.message);
  } finally {
    saving.value = false;
  }
}

async function onRemove(item) {
  try {
    await masterApi.removeChecklistItem(selectedMasterId.value, item.id);
    await fetchItems();
    toast.success('Checklist item dihapus');
  } catch (error) {
    toast.error(error.message);
  }
}

watch(selectedMasterId, fetchItems);

onMounted(fetchMasters);
</script>

<template>
  <section class="checklist">
    <h1 class="checklist__title">Checklist</h1>

    <div class="field checklist__picker">
      <SelectField
        v-model="selectedMasterId"
        label="Work Order Master"
        :options="masterOptions"
        placeholder="Pilih work order master"
      />
    </div>

    <DataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      empty-title="Belum ada checklist item"
    >
      <template v-if="auth.canWrite" #cell-actions="{ row }">
        <button type="button" class="btn btn--danger" @click="onRemove(row)">Hapus</button>
      </template>
    </DataTable>

    <form v-if="auth.canWrite" class="card checklist__form" @submit.prevent="onAdd">
      <h2 class="checklist__form-title">Tambah Checklist Item</h2>
      <div class="field">
        <label for="checklist-label">Label</label>
        <input id="checklist-label" v-model="newLabel" class="input" required />
      </div>
      <div class="field">
        <label for="checklist-order">Urutan</label>
        <input id="checklist-order" v-model="newSortOrder" class="input" type="number" />
      </div>
      <button
        type="submit"
        class="btn btn--primary"
        :disabled="saving || !selectedMasterId"
      >
        Simpan
      </button>
    </form>
  </section>
</template>

<style scoped>
.checklist__title {
  font-size: var(--font-xl);
  margin-bottom: var(--space-4);
}

.checklist__picker {
  max-width: 320px;
  margin-bottom: var(--space-4);
}

.checklist__form {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 420px;
}

.checklist__form-title {
  font-size: var(--font-lg);
}
</style>