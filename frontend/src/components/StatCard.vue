<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '' },
  variant: { type: String, default: 'default' },
});
</script>

<template>
  <div class="card stat" :class="`stat--${variant}`">
    <p class="stat__label">{{ label }}</p>
    <p class="stat__value">{{ value }}</p>
  </div>
</template>

<style scoped>
.stat__label {
  margin: 0 0 var(--space-1);
  font-size: var(--font-sm);
  color: var(--color-text-muted);
}

.stat__value {
  margin: 0;
  font-size: var(--font-xl);
  font-weight: 600;
}

.stat--success .stat__value {
  color: var(--status-complete);
}

.stat--danger .stat__value {
  color: var(--status-on-hold);
}
</style>