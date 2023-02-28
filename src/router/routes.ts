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
        name: 'moule',
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
