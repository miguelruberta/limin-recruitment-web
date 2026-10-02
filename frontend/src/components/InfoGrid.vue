<script setup>
defineProps({
  items: { type: Array, required: true },
  columns: { type: Number, default: 3 },
});
</script>

<template>
  <dl class="info-grid" :style="{ '--columns': columns }">
    <div v-for="item in items" :key="item.label" class="info-grid__item">
      <dt class="info-grid__label">{{ item.label }}</dt>
      <dd class="info-grid__value">
        <slot :name="`value-${item.key}`" :item="item">
          {{ item.value ?? '-' }}
        </slot>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  gap: var(--space-4);
  margin: 0;
}

.info-grid__label {
  font-size: var(--font-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}

.info-grid__value {
  margin: 0;
  font-size: var(--font-md);
}
</style>