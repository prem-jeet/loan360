import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/ProductsLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/main',
    name: 'main',
    // meta: { layout: MainLayout },
    component: () => import('pages/MainPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
