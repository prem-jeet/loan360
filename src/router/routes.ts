import { useUserStore } from 'src/stores/user/userStore';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    beforeEnter: () => {
      const userStore = useUserStore();

      if (userStore.isLoggedIn && userStore.idToken === '') {
        userStore.setToken(
          JSON.parse(localStorage.getItem('jaguar') as string) as {
            id_token: string;
            expires_in: number;
          }
        );
        return {
          name: 'authenticated',
        };
      }
    },
    component: () => import('pages/Login.vue'),
    children: [
      {
        name: 'authenticated',
        path: 'authenticated',
        component: () => import('pages/Login.vue'),
      },
    ],
  },

  {
    path: '/module',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'los',
        name: 'loanOrganizationSystem',
        component: () =>
          import(
            'pages/modules/loanOrganizationSystem/LoanOrganizationSystem.vue'
          ),
      },
      {
        path: 'lms',
        name: 'loanManagementSystem',
        component: () =>
          import('pages/modules/loanManagementSystem/LoanManagementSystem.vue'),
      },
      {
        path: 'collection',
        name: 'collection',
        component: () => import('pages/modules/collection/Collection.vue'),
      },
      {
        path: 'fa',
        name: 'financialAccounting',
        component: () =>
          import('pages/modules/financialAccounting/FinancialAccounting.vue'),
      },
      {
        path: 'td',
        name: 'termDeposit',
        component: () => import('pages/modules/termDeposit/TermDeposit.vue'),
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: () => import('pages/modules/maintenance/Maintenance.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/modules/settings/Settings.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
