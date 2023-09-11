<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
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
import NavBar from 'src/components/ui/header/NavBar.vue';
import LeftMenu from 'src/components/LeftMenu.vue';
import { ref, onBeforeMount, computed } from 'vue';
import { useMenuStore } from 'src/stores/menu/menuStore';
import { useUserStore } from 'src/stores/user/userStore';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';

const userStore = useUserStore();

const drawerLeft = ref(false);
const menuStore = useMenuStore();

const openMenu = () => {
  drawerLeft.value = !drawerLeft.value;
};

const isCompanyAndBranchSelectorModalActive = computed(
  () => userStore.companyModal
);

const getDataOnRefresh = async () => {
  // Header Set for loggedIn user
  if (userStore.token && userStore.token.id_token) {
    userStore.setAuthHeader(userStore.token.id_token);
  } else {
    userStore.setAuthHeader('');
  }
  if (userStore.fetchUser()) {
    await userStore.fetchAppRole();
    await menuStore.fetchMenu();
  }
};

onBeforeMount(() => {
  getDataOnRefresh();
});
</script>
<style>
.q-drawer {
  top: 64px !important;
}
</style>
