import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/index.vue'),
  },
  {
    path: '/login',
    name: 'login',

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
    path: '/moduleselector',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'moduleSelector',
        component: () => import('pages/ModuleSelector.vue'),
      },
    ],
  },

  {
    path: '/module',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':module',
        name: 'module',
        component: () => import('pages/Module.vue'),
        props: ({ params }) => ({ module: params.module }),
        beforeEnter: (to) => {
          const module = to.params.module as string;
          const availableModules = [
            'los',
            'lms',
            'td',
            'collection',
            'settings',
            'maintenance',
            'fa',
          ];
          if (!availableModules.includes(module)) {
            return { name: 'notFound' };
          }
        },
        children: [
          {
            path: 'accountCode',
            name: 'accountCode',
            component: () => import('pages/settings/accounts/AccountCode.vue'),
          },
          {
            path: 'natureEntry',
            name: 'natureEntry',
            component: () => import('pages/settings/accounts/NatureEntry.vue'),
          },
          {
            path: 'interestDepositGenerate',
            name: 'interestDepositGenerate',
            component: () =>
              import('pages/settings/accounts/InterestDepositGenerate.vue'),
          },
          {
            path: 'customerMaster/namePrefix',
            name: 'namePrefix',
            component: () =>
              import('pages/maintenance/customerMaster/NamePrefix.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'notFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
