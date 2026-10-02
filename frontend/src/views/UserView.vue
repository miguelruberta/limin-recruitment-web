<script setup>
import { onMounted, ref } from 'vue';
import DataTable from '@/components/DataTable.vue';
import SearchInput from '@/components/SearchInput.vue';
import SelectField from '@/components/SelectField.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import { UserApi } from '@/services/UserApi.js';
import { apiClient } from '@/services/api.js';
import { useToast } from '@/composables/useToast.js';

const userApi = new UserApi(apiClient);
const toast = useToast();

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'isActive', label: 'Aktif' },
  { key: 'actions', label: 'Aksi' },
];

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPERINTENDENT', label: 'Superintendent' },
  { value: 'VIEWER', label: 'Viewer' },
];

const rows = ref([]);
const search = ref('');
const loading = ref(false);
const saving = ref(false);
const editingId = ref(null);
const form = ref({ name: '', email: '', password: '', role: 'VIEWER' });

async function fetchRows() {
  loading.value = true;
  try {
    const result = await userApi.list({ search: search.value, limit: 100 });
    rows.value = (result?.data ?? result ?? []).map((row) => ({ ...row, id: Number(row.id) }));
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  editingId.value = null;
  form.value = { name: '', email: '', password: '', role: 'VIEWER' };
}

function startEdit(row) {
  editingId.value = row.id;
  form.value = { name: row.name, email: row.email, password: '', role: row.role };
}

async function onSubmit() {
  saving.value = true;
  try {
    const payload = { ...form.value };
    if (editingId.value && !payload.password) delete payload.password;

    if (editingId.value) {
      await userApi.update(editingId.value, payload);
      toast.success('Pengguna diperbarui');
    } else {
      await userApi.create(payload);
      toast.success('Pengguna ditambahkan');
    }
    resetForm();
    await fetchRows();
  } catch (error) {
    toast.error(error.message);
  } finally {
    saving.value = false;
  }
}

onMounted(fetchRows);
</script>

<template>
  <section class="users">
    <h1 class="users__title">Users</h1>

    <div class="users__toolbar">
      <SearchInput v-model="search" placeholder="Cari pengguna..." @search="fetchRows" />
    </div>

    <DataTable :columns="columns" :rows="rows" :loading="loading" empty-title="Belum ada pengguna">
      <template #cell-role="{ value }">
        <StatusBadge :status="value === 'ADMIN' ? 'HIGH' : 'MEDIUM'" />
      </template>
      <template #cell-isActive="{ value }">
        <span :class="value ? 'text-success' : 'text-muted'">
          {{ value ? 'Aktif' : 'Nonaktif' }}
        </span>
      </template>
      <template #cell-actions="{ row }">
        <button type="button" class="btn users__action" @click="startEdit(row)">Edit</button>
      </template>
    </DataTable>

    <form class="card users__form" @submit.prevent="onSubmit">
      <h2 class="users__form-title">
        {{ editingId ? 'Edit Pengguna' : 'Tambah Pengguna' }}
      </h2>
      <div class="field">
        <label for="user-name">Nama</label>
        <input id="user-name" v-model="form.name" class="input" required />
      </div>
      <div class="field">
        <label for="user-email">Email</label>
        <input id="user-email" v-model="form.email" class="input" type="email" required />
      </div>
      <div class="field">
        <label for="user-password">Password</label>
        <input
          id="user-password"
          v-model="form.password"
          class="input"
          type="password"
          :required="!editingId"
          minlength="10"
          autocomplete="new-password"
        />
      </div>
      <SelectField v-model="form.role" label="Role" :options="roleOptions" />
      <div class="users__form-actions">
        <button type="submit" class="btn btn--primary" :disabled="saving">
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
        <button v-if="editingId" type="button" class="btn" @click="resetForm">Batal</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.users__title {
  font-size: var(--font-xl);
  margin-bottom: var(--space-4);
}

.users__toolbar {
  margin-bottom: var(--space-4);
}

.users__action {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-sm);
}

.users__form {
  margin-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 420px;
}

.users__form-title {
  font-size: var(--font-lg);
}

.users__form-actions {
  display: flex;
  gap: var(--space-2);
}
</style>