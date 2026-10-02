<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Cari...' },
  delay: { type: Number, default: 350 },
});

const emit = defineEmits(['search', 'update:modelValue']);

const keyword = ref(props.modelValue);
let timer = null;

watch(keyword, (value) => {
  emit('update:modelValue', value);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => emit('search', value), props.delay);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <input
    v-model="keyword"
    type="search"
    class="input search"
    :placeholder="placeholder"
    :aria-label="placeholder"
  />
</template>

<style scoped>
.search {
  min-width: 220px;
}
</style>