<template>
  <q-layout view="lHh lpR lFf">
    <q-header
      class="transparent"
      :style="{ transition: 'top 250ms', top: `${hideHeader ? '-12%' : 0}` }"
    >
      <NavBar @openMenu="openMenu" />
    </q-header>

    <q-page-container bg-page class="overflow-auto" style="max-height: 100vh">
      <q-page v-scroll="toggleHeaderVisibility" ref="page">
        <RouterView @openMenu="openMenu"></RouterView>
      </q-page>
    </q-page-container>
    <q-drawer
      v-model="drawerLeft"
      overlay
      elevated
      :width="screenWidth < 560 ? screenWidth : 480"
      class="bg-white"
    >
      <LeftMenu :key="menuStore.currentModule" @close="drawerLeft = false" />
      <div v-if="drawerLeft" @click="drawerLeft = false" drawer-overlay />
      <q-btn
        drawer-close
        color="red-10 text-white"
        size="md"
        round
        icon="close"
        v-if="screenWidth > 560 && drawerLeft"
        @click="drawerLeft = false"
      >
      </q-btn>
    </q-drawer>
    <CompanyAndBranchSelectorModal
      v-if="isCompanyAndBranchSelectorModalActive"
    />
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/ui/header/NavBar.vue';
import LeftMenu from 'src/components/LeftMenu.vue';
import { watch, ref, onBeforeMount, computed } from 'vue';
import { useMenuStore } from 'src/stores/menu/menuStore';
import { useUserStore } from 'src/stores/user/userStore';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';
import { useScreenSize } from 'src/composables/utilComposibles';

const userStore = useUserStore();

const drawerLeft = ref(false);
const menuStore = useMenuStore();
const hideHeader = ref(false);

const { screenWidth } = useScreenSize();
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
    try {
      await userStore.fetchAppRole();
      await menuStore.fetchMenu();
    } catch (e) {}
  }
};

onBeforeMount(() => {
  getDataOnRefresh();
});

const toggleHeaderVisibility = (position: number) => {
  if (position > 50) {
    hideHeader.value = true;
  } else if (position <= 5) {
    hideHeader.value = false;
  }
};

watch(drawerLeft, () => {
  const element = document.querySelector('#q-app');
  if (drawerLeft.value) {
    element?.classList.add('no-scroll');
  } else {
    element?.classList.remove('no-scroll');
  }
});
</script>

<style>
[drawer-overlay] {
  background: red;
  position: absolute;
  top: 0;
  left: 0;
  width: 200vw;
  height: 100vh;
  z-index: -100;
  background: rgba(106, 168, 250, 0.25);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(106, 168, 250, 0.125);
}
[drawer-close] {
  position: absolute;
  left: 490px;
  top: 10px;
}
</style>
