<script setup>
defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  label: { type: String, required: true },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Pilih...' },
  disabled: { type: Boolean, default: false },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="field">
    <label :for="`select-${label}`">{{ label }}</label>
    <select
      :id="`select-${label}`"
      class="select"
      :value="modelValue ?? ''"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value === '' ? null : $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>