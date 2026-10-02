<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p class="text-muted">Halaman yang Anda cari tidak ditemukan.</p>
    <RouterLink class="btn" :to="{ name: 'dashboard' }">Kembali ke Dashboard</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}
</style>