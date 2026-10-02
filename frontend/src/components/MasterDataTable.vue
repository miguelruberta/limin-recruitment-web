<script setup>
import { onMounted, ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DataTable from '@/components/DataTable.vue';
import SearchInput from '@/components/SearchInput.vue';
import { MasterApi } from '@/services/MasterApi.js';
import { apiClient } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth.js';
import { useToast } from '@/composables/useToast.js';

const props = defineProps({
  resource: { type: String, required: true },
  title: { type: String, required: true },
  columns: { type: Array, required: true },
  fields: { type: Array, default: () => [] },
  emptyTitle: { type: String, default: 'Belum ada data' },
});

const masterApi = new MasterApi(apiClient);
const auth = useAuthStore();
const toast = useToast();

const rows = ref([]);
const search = ref('');
const loading = ref(false);
const error = ref('');
const editingId = ref(null);
const form = ref({});
const saving = ref(false);
const pendingDelete = ref(null);
const deleting = ref(false);

function resetForm() {
  editingId.value = null;
  form.value = Object.fromEntries(props.fields.map((field) => [field.name, field.default ?? '']));
}

async function fetchRows() {
  loading.value = true;
  error.value = '';
  try {
    const result = await masterApi.list(props.resource, { search: search.value, limit: 100 });
    rows.value = (result?.data ?? result ?? []).map((row) => ({
      ...row,
      id: Number(row.id),
    }));
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

function startEdit(row) {
  editingId.value = row.id;
  form.value = Object.fromEntries(
    props.fields.map((field) => [field.name, row[field.name] ?? '']),
  );
}

async function onSubmit() {
  saving.value = true;
  try {
    if (editingId.value) {
      await masterApi.update(props.resource, editingId.value, form.value);
      toast.success('Perubahan disimpan');
    } else {
      await masterApi.create(props.resource, form.value);
      toast.success('Data ditambahkan');
    }
    resetForm();
    await fetchRows();
  } catch (requestError) {
    toast.error(requestError.message);
  } finally {
    saving.value = false;
  }
}

async function onConfirmDelete() {
  deleting.value = true;
  try {
    await masterApi.remove(props.resource, pendingDelete.value.id);
    toast.success('Data dihapus');
    pendingDelete.value = null;
    await fetchRows();
  } catch (requestError) {
    toast.error(requestError.message);
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  resetForm();
  fetchRows();
});
</script>

<template>
  <section class="master">
    <h1 class="master__title">{{ title }}</h1>

    <div class="master__toolbar">
      <SearchInput v-model="search" placeholder="Cari..." @search="fetchRows" />
    </div>

    <p v-if="error" class="text-danger">{{ error }}</p>

    <DataTable :columns="columns" :rows="rows" :loading="loading" :empty-title="emptyTitle">
      <template v-if="auth.canWrite" #cell-actions="{ row }">
        <button type="button" class="btn master__action" @click="startEdit(row)">Edit</button>
        <button
          type="button"
          class="btn btn--danger master__action"
          @click="pendingDelete = row"
        >
          Hapus
        </button>
      </template>
    </DataTable>

    <form v-if="auth.canWrite" class="card master__form" @submit.prevent="onSubmit">
      <h2 class="master__form-title">
        {{ editingId ? 'Edit Data' : 'Tambah Data' }}
      </h2>
      <div v-for="field in fields" :key="field.name" class="field">
        <label :for="`${resource}-${field.name}`">{{ field.label }}</label>
        <select
          v-if="field.options"
          :id="`${resource}-${field.name}`"
          v-model="form[field.name]"
          class="select"
          :required="field.required ?? false"
        >
          <option value="">{{ field.placeholder ?? 'Pilih...' }}</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <input
          v-else
          :id="`${resource}-${field.name}`"
          v-model="form[field.name]"
          class="input"
          :type="field.type ?? 'text'"
          :required="field.required ?? false"
        />
      </div>
      <div class="master__form-actions">
        <button type="submit" class="btn btn--primary" :disabled="saving">
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button v-if="editingId" type="button" class="btn" @click="resetForm">Batal</button>
      </div>
    </form>

    <ConfirmDialog
      :open="Boolean(pendingDelete)"
      :title="`Hapus ${pendingDelete?.name ?? title}`"
      message="Data yang dihapus tidak dapat dikembalikan."
      :busy="deleting"
      @confirm="onConfirmDelete"
      @cancel="pendingDelete = null"
    />
  </section>
</template>

<style scoped>
.master__title {
  font-size: var(--font-xl);
  margin-bottom: var(--space-4);
}

.master__toolbar {
  margin-bottom: var(--space-4);
}

.master__action {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-sm);
  margin-right: var(--space-1);
}

.master__form {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 420px;
}

.master__form-title {
  font-size: var(--font-lg);
}

.master__form-actions {
  display: flex;
  gap: var(--space-2);
}
</style>