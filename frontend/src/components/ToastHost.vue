<script setup>
import { useToast } from '@/composables/useToast.js';

const toast = useToast();
</script>

<template>
  <div class="toast-host">
    <button
      v-for="item in toast.items"
      :key="item.id"
      type="button"
      class="toast"
      :class="`toast--${item.type}`"
      @click="toast.dismiss(item.id)"
    >
      {{ item.message }}
    </button>
  </div>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  z-index: 1000;
}

.toast {
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius);
  color: #fff;
  font-family: inherit;
  font-size: var(--font-md);
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow);
}

.toast--success {
  background: var(--status-complete);
}

.toast--error {
  background: var(--status-on-hold);
}

.toast--info {
  background: var(--color-primary);
}
</style>