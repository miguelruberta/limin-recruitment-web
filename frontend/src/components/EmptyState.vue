<script setup>
defineProps({
  title: { type: String, default: 'Belum ada data' },
  description: { type: String, default: '' },
});
</script>

<template>
  <div class="empty">
    <p class="empty__title">{{ title }}</p>
    <p v-if="description" class="empty__description text-muted">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty {
  padding: var(--space-8) var(--space-4);
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.empty__title {
  margin: 0 0 var(--space-2);
  font-weight: 600;
}

.empty__description {
  margin: 0;
  font-size: var(--font-sm);
}
</style>