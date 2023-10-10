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
[bg-page] {
  background-color: hsla(205, 0%, 100%, 1);
  background-image: radial-gradient(
      at 15% 23%,
      hsla(197, 97%, 47%, 0.12) 0px,
      transparent 50%
    ),
    radial-gradient(at 37% 92%, hsla(207, 100%, 95%, 0.27) 0px, transparent 50%),
    radial-gradient(at 80% 100%, hsla(206, 76%, 84%, 0.51) 0px, transparent 50%);
  background-size: 150% 150% !important;
  animation: gradient-animation 10s ease-in-out infinite alternate both;
}

@keyframes gradient-animation {
  0% {
    background-position: 0% 0%;
  }
  25% {
    background-position: 50% 50%;
  }
  50% {
    background-position: 20% 20%;
  }
  75% {
    background-position: 5% 5%;
  }
  100% {
    background-position: 100% 100%;
  }
}
.body--dark [bg-page] {
  background-image: linear-gradient(
    10deg,
    hsl(199deg 11% 28%) 0%,
    hsl(203deg 17% 23%) 1%,
    hsl(208deg 23% 19%) 7%,
    hsl(213deg 30% 15%) 21%,
    hsl(220deg 37% 12%) 46%,
    hsl(237deg 48% 8%) 68%,
    hsl(238deg 55% 7%) 81%,
    hsl(239deg 65% 7%) 89%,
    hsl(239deg 79% 6%) 95%,
    hsl(239deg 98% 5%) 98%,
    hsl(0deg 0% 0%) 100%
  );
}
</style>
