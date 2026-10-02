import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'dry-docks',
        name: 'dry-docks',
        component: () => import('@/views/DryDockListView.vue'),
      },
      {
        path: 'dry-docks/:id',
        name: 'dry-dock-detail',
        component: () => import('@/views/DryDockDetailView.vue'),
        props: true,
      },
      {
        path: 'specification-groups',
        name: 'specification-groups',
        component: () => import('@/views/SpecificationGroupView.vue'),
      },
      {
        path: 'work-order-masters',
        name: 'work-order-masters',
        component: () => import('@/views/WorkOrderMasterView.vue'),
      },
      {
        path: 'checklists',
        name: 'checklists',
        component: () => import('@/views/ChecklistView.vue'),
      },
      {
        path: 'shipyards',
        name: 'shipyards',
        component: () => import('@/views/ShipyardView.vue'),
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        component: () => import('@/views/SupplierView.vue'),
      },
      {
        path: 'vessels',
        name: 'vessels',
        component: () => import('@/views/VesselView.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UserView.vue'),
        meta: { roles: ['ADMIN'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.restoreSession();

  if (to.meta.public) {
    if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' };
    return true;
  }

  if (!auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } };

  const allowedRoles = to.meta.roles;
  if (Array.isArray(allowedRoles) && !allowedRoles.includes(auth.role)) {
    return { name: 'dashboard' };
  }

  return true;
});