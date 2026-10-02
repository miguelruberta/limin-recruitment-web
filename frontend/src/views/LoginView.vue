<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function onSubmit() {
  errorMessage.value = '';
  try {
    await auth.login({ email: email.value, password: password.value });
    router.push(route.query.redirect ?? { name: 'dashboard' });
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<template>
  <div class="login">
    <form class="card login__card" @submit.prevent="onSubmit">
      <h1 class="login__title">Dry Dock Management</h1>
      <p class="text-muted login__subtitle">Masuk untuk melanjutkan</p>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" class="input" type="email" required autocomplete="username" />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          class="input"
          type="password"
          required
          autocomplete="current-password"
        />
      </div>

      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>

      <button type="submit" class="btn btn--primary login__submit" :disabled="auth.loading">
        {{ auth.loading ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.login__card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.login__title {
  font-size: var(--font-xl);
}

.login__subtitle {
  margin: 0;
  font-size: var(--font-sm);
}

.login__submit {
  justify-content: center;
}
</style>