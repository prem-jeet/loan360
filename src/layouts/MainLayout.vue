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
    <CompanyAndBranchSelectorModal
      v-if="isCompanyAndBranchSelectorModalActive"
    />
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/NavBar.vue';
import LeftMenu from 'src/components/LeftMenu.vue';
import { ref, onMounted, computed } from 'vue';
import { useMenuStore } from 'src/stores/menu/menuStore';
import { useRouter } from 'vue-router';

import { useUserStore } from 'src/stores/user/userStore';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';

const router = useRouter();

const userStore = useUserStore();

const goToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const drawerLeft = ref(false);
const menuStore = useMenuStore();

const openMenu = () => {
  drawerLeft.value = !drawerLeft.value;
};

const isCompanyAndBranchSelectorModalActive = computed(
  () => userStore.companyModal
);

onMounted(() => {
  // Header Set and Authentication

  if (userStore.token && userStore.token.id_token) {
    userStore.setAuthHeader(userStore.token.id_token);
  } else {
    userStore.setAuthHeader('');
    router.push({ name: 'login' });
  }
});
</script>
