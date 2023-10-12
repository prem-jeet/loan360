<template>
  <q-layout view="lHh lpR lFf">
    <q-header
      class="transparent"
      :style="{ transition: 'top 250ms', top: `${hideHeader ? '-12%' : 0}` }"
    >
      <NavBar @open-drawer="openDrawer" />
    </q-header>

    <q-page-container bg-page class="overflow-auto" style="max-height: 100vh">
      <q-page v-scroll="toggleHeaderVisibility" ref="page">
        <RouterView></RouterView>
      </q-page>
    </q-page-container>
    <q-drawer
      v-model="isDrawerActive"
      overlay
      elevated
      :width="screenWidth < 560 ? screenWidth : 480"
      class="bg-white"
    >
      <div class="q-pa-sm items-center flex" style="background: #6ec2ff36">
        <q-tabs
          v-model="tab"
          class="text-black col-grow"
          active-color="indigo-10"
          indicator-color="primary"
          align="center"
          narrow-indicator
        >
          <q-tab icon="search" name="menu" v-if="shouldShowMenuTab" />
          <q-tab icon="notifications" name="notification" />
          <q-tab icon="person" name="account" />
        </q-tabs>
        <q-space />
        <q-btn
          icon="keyboard_double_arrow_left"
          flat
          size="md"
          padding="sm sm"
          class="text-weight-bold"
          color="black"
          @click="isDrawerActive = false"
        />
      </div>
      <q-tab-panels
        v-model="tab"
        animated
        style="height: 90vh; overflow-y: auto"
        left-drawer
      >
        <q-tab-panel name="menu" v-if="shouldShowMenuTab">
          <ModuleSearchMenu
            :key="menuStore.currentModule"
            @close="isDrawerActive = false"
          />
        </q-tab-panel>

        <q-tab-panel name="notification">
          <div class="text-h6">No notification</div>
        </q-tab-panel>

        <q-tab-panel name="account">
          <div class="full-height column">
            <div class="col-grow">
              <AccountMenu />
            </div>
            <q-btn
              label="logout"
              icon="logout"
              size="lg"
              padding="md sm"
              @click="logout"
              color="red-7"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <div
        v-if="isDrawerActive"
        @click="isDrawerActive = false"
        drawer-overlay
      />
    </q-drawer>
    <CompanyAndBranchSelectorModal
      v-if="isCompanyAndBranchSelectorModalActive"
    />
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/ui/header/NavBar.vue';
import ModuleSearchMenu from 'src/components/ModuleSearchMenu.vue';
import { watch, ref, onBeforeMount, computed } from 'vue';
import { useMenuStore } from 'src/stores/menu/menuStore';
import { useUserStore } from 'src/stores/user/userStore';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';
import { useScreenSize } from 'src/composables/utilComposibles';
import { useRoute } from 'vue-router';
import AccountMenu from 'src/components/AccountMenu.vue';
import { asyncConfirmDialog } from 'src/utils/notification';

const userStore = useUserStore();

const isDrawerActive = ref(false);
const menuStore = useMenuStore();
const hideHeader = ref(false);
const route = useRoute();

const tab = ref('');
const { screenWidth } = useScreenSize();
const shouldShowMenuTab = computed(
  () => !['moduleSelector', 'module'].includes(route.name as string)
);

const isCompanyAndBranchSelectorModalActive = computed(
  () => userStore.companyModal
);

const openDrawer = (state: 'menu' | 'notification' | 'account') => {
  tab.value = state;
  isDrawerActive.value = !isDrawerActive.value;
};

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

const logout = async () => {
  const confirm = await asyncConfirmDialog({
    title: 'Logout ?',
    msg: 'Are you sure you want to logout ?',
  });

  if (confirm) {
    localStorage.clear();
    window.location.assign('/');
  }
};
watch(isDrawerActive, () => {
  const element = document.querySelector('#q-app');
  if (isDrawerActive.value) {
    element?.classList.add('no-scroll');
  } else {
    element?.classList.remove('no-scroll');
  }
});
</script>

<style>
[left-drawer] {
  font-size: calc(var(--c-font-size) * 0.85);
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
