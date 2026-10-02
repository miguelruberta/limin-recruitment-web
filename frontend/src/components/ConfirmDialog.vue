<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Lanjutkan tindakan ini?' },
  busy: { type: Boolean, default: false },
});

defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div v-if="open" class="dialog" role="dialog" aria-modal="true">
    <div class="dialog__panel card">
      <h3 class="dialog__title">{{ title }}</h3>
      <p class="dialog__message">{{ message }}</p>
      <div class="dialog__actions">
        <button type="button" class="btn" :disabled="busy" @click="$emit('cancel')">
          Batal
        </button>
        <button type="button" class="btn btn--danger" :disabled="busy" @click="$emit('confirm')">
          {{ busy ? 'Memproses...' : 'Hapus' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
}

.dialog__panel {
  max-width: 420px;
  width: 100%;
}

.dialog__title {
  margin-bottom: var(--space-2);
  font-size: var(--font-lg);
}

.dialog__message {
  margin: 0 0 var(--space-4);
  color: var(--color-text-muted);
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
</style>