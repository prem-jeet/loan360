<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <NavBar @openMenu="openMenu" />
    </q-header>
    <q-page-container>
      <q-page>
        <RouterView @openMenu="openMenu"></RouterView>
        <q-page-scroller
          position="bottom-right"
          :scroll-offset="100"
          :offset="[15, 15]"
        >
          <q-btn
            fab
            icon="keyboard_arrow_up"
            color="blue-5"
            class="light-dimmed"
            @click="goToTop"
            unelevated
            :ripple="false"
          />
        </q-page-scroller>
      </q-page>
    </q-page-container>
    <q-drawer v-model="drawerLeft" overlay elevated>
      <LeftMenu :key="menuStore.currentModule" />
    </q-drawer>
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/NavBar.vue';
import LeftMenu from 'src/components/LeftMenu.vue';
import { ref, onMounted } from 'vue';
import { useMenuStore } from 'src/stores/menu/menuStore';
import { useRouter } from 'vue-router';

import { useUserStore } from 'src/stores/user/userStore';

const router = useRouter();

const userStore = useUserStore();

const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const drawerLeft = ref(false);
const menuStore = useMenuStore();

const openMenu = () => {
  drawerLeft.value = !drawerLeft.value;
};

onMounted(() => {
  // Header Set and Authentication
  const authToken = localStorage.getItem('authToken') || '';
  const expires_in = localStorage.getItem('expires_in') || 0;

  if (userStore.token && userStore.token.id_token) {
    userStore.setAuthHeader(userStore.token.id_token);
  } else if (authToken) {
    userStore.setAuthHeader(authToken);
    userStore.setToken({
      id_token: authToken,
      expires_in: Number(expires_in),
    });
  } else {
    userStore.setAuthHeader('');
    router.push({ name: 'login' });
  }
});
</script>
