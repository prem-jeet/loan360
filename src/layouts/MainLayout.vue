<template>
  <q-layout view="lHh lpR lFf">
    <q-header class="transparent">
      <NavBar @openMenu="openMenu" />
    </q-header>

    <q-page-container
      :class="[isDark ? 'page-dark' : 'page-light']"
      page-container
    >
      <q-page>
        <RouterView @openMenu="openMenu"></RouterView>
      </q-page>
    </q-page-container>
    <q-drawer
      v-model="drawerLeft"
      overlay
      elevated
      :width="480"
      class="bg-white"
    >
      <LeftMenu :key="menuStore.currentModule" />
      <div v-if="drawerLeft" @click="drawerLeft = false" drawer-overlay />
      <q-btn
        drawer-close
        color="red-10 text-white"
        size="md"
        round
        icon="close"
        v-if="drawerLeft"
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
import { ref, onBeforeMount, computed } from 'vue';
import { useMenuStore } from 'src/stores/menu/menuStore';
import { useUserStore } from 'src/stores/user/userStore';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';
import { useDarkMode } from 'src/composables/utilComposibles';

const userStore = useUserStore();

const drawerLeft = ref(false);
const menuStore = useMenuStore();

const { isDark } = useDarkMode();

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
.page-light {
  background-image: linear-gradient(
    5deg,
    hsl(218deg 77% 78%) 0%,
    hsl(210deg 79% 82%) 13%,
    hsl(204deg 77% 87%) 28%,
    hsl(198deg 73% 94%) 48%,
    hsl(202deg 67% 98%) 99%,
    hsl(219deg 44% 97%) 101%,
    hsl(255deg 24% 95%) 101%,
    hsl(310deg 18% 93%) 100%
  );
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
.page-dark {
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
