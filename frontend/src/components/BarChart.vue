<script setup>
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  labels: { type: Array, default: () => [] },
  datasets: { type: Array, default: () => [] },
  height: { type: Number, default: 260 },
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true } },
  plugins: { legend: { position: 'top' } },
};
</script>

<template>
  <div class="bar" :style="{ height: `${height}px` }">
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<style scoped>
.bar {
  width: 100%;
}
</style>