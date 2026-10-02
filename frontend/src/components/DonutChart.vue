<script setup>
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  'var(--chart-blue)',
  'var(--chart-green)',
  'var(--chart-pink)',
  'var(--chart-gold)',
  'var(--chart-teal)',
];

const props = defineProps({
  items: { type: Array, default: () => [] },
  height: { type: Number, default: 220 },
});

const chartData = computed(() => ({
  labels: props.items.map((item) => item.label),
  datasets: [
    {
      data: props.items.map((item) => item.value),
      backgroundColor: props.items.map((_, index) => PALETTE[index % PALETTE.length]),
      borderWidth: 0,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right' } },
};
</script>

<template>
  <div class="donut" :style="{ height: `${height}px` }">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>

<style scoped>
.donut {
  width: 100%;
}
</style>