<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

const navItems = computed(() => {
  const items = [
    { name: 'Dashboard', to: { name: 'dashboard' } },
    { name: 'Specification Groups', to: { name: 'specification-groups' } },
    { name: 'Work Order Master', to: { name: 'work-order-masters' } },
    { name: 'Checklist', to: { name: 'checklists' } },
    { name: 'Dry Docks', to: { name: 'dry-docks' } },
  ];

  if (auth.isAdmin) items.push({ name: 'Users', to: { name: 'users' } });
  return items;
});

async function onLogout() {
  await auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <p class="sidebar__brand">Dry Dock</p>
      <nav class="sidebar__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="sidebar__link"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>

    <div class="layout__main">
      <header class="topbar">
        <span class="topbar__user">{{ auth.displayName }} ({{ auth.role }})</span>
        <button type="button" class="btn" @click="onLogout">Logout</button>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: var(--space-4);
}

.sidebar__brand {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--space-6);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar__link {
  padding: var(--space-2);
  border-radius: var(--radius);
  color: var(--color-text);
}

.sidebar__link.router-link-active {
  background: var(--color-primary);
  color: #fff;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.topbar__user {
  font-size: var(--font-sm);
  color: var(--color-text-muted);
}

.content {
  flex: 1;
  padding: var(--space-6);
  max-width: var(--content-max-width);
  width: 100%;
}
</style>