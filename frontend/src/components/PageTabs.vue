<script setup>
defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, required: true },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <nav class="tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      type="button"
      role="tab"
      class="tabs__item"
      :class="{ 'tabs__item--active': tab.name === modelValue }"
      :aria-selected="tab.name === modelValue"
      @click="$emit('update:modelValue', tab.name)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: var(--space-1);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-4);
  overflow-x: auto;
}

.tabs__item {
  padding: var(--space-2) var(--space-4);
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--font-md);
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tabs__item--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>