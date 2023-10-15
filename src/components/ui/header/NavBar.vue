<template>
  <div v-if="screenWidth > 540" class="flex flex-center">
    <div
      class="q-my-xs q-mb-md text-black flex items-center q-px-lg q-py-sm"
      style="width: 98vw; border-radius: 5px"
      navbar
    >
      <div class="flex items-center" style="gap: 20px">
        <q-btn
          flat
          round
          unelevated
          :ripple="false"
          @click="() => emits('openDrawer', 'menu')"
          icon="menu_open"
          size="22px"
          v-if="!['moduleSelector', 'module'].includes(route.name as string)"
        />

        <div class="flex items-center">
          <div navbar-logo class="flex flex-center">
            <q-img :src="logo" fit="cover" />
          </div>

          <router-link
            :to="{ name: 'moduleSelector' }"
            :style="{ textDecoration: 'none' }"
            class="flex flex-center q-ml-md"
          >
            <span navbar-title class="text-weight-medium">
              Jaguar 360° Cloud
            </span>
          </router-link>
        </div>
      </div>

      <div class="flex items-center q-ml-auto">
        <CompanyAndBranchSelectorModal
          v-if="isCompanyAndBranchSelectorModalActive"
          @close="isCompanyAndBranchSelectorModalActive = false"
        />
        <q-btn
          :size="screenWidth < 650 ? '20px' : '25px'"
          icon="location_on"
          flat
          @click="isCompanyAndBranchSelectorModalActive = true"
        />
        <q-btn
          :size="screenWidth < 650 ? '22px' : '25px'"
          round
          color="grey-5"
          text-color="blue-grey-10"
          class="q-ml-md text-weight-bold text-h6"
          padding="sm md"
          :label="(userAvatar as string)"
          @click="() => emits('openDrawer', 'account')"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="fixed-bottom full-width q-pa-md q-px-xl text-black flex justify-between"
    bottom-navbar
  >
    <q-icon
      class="cursor-pointer"
      name="menu"
      size="md"
      @click="() => emits('openDrawer', 'menu')"
      v-if="!['moduleSelector', 'module'].includes(route.name as string)"
    />
    <router-link
      to="/"
      :class="[route.name === 'moduleSelector' ? 'text-blue-10' : 'text-black']"
    >
      <q-icon class="cursor-pointer" name="home" size="md" />
    </router-link>
    <q-icon
      class="cursor-pointer"
      name="notifications"
      size="md"
      @click="() => emits('openDrawer', 'notification')"
    />
    <q-icon
      class="cursor-pointer"
      name="person"
      size="md"
      @click="() => emits('openDrawer', 'account')"
    />
  </div>
</template>
<script setup lang="ts">
import logo from 'src/assets/img/jaguarlogo.png';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

import { useUserStore } from 'src/stores/user/userStore';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';
import { useScreenSize } from 'src/composables/utilComposibles';

const userStore = useUserStore();
const userAvatar = computed(() =>
  userStore.decodedIdToken.given_name
    ? userStore.decodedIdToken.given_name.charAt(0).toUpperCase()
    : null
);
const { screenWidth } = useScreenSize();

const emits = defineEmits(['openDrawer']);
const route = useRoute();

const isCompanyAndBranchSelectorModalActive = ref(false);
</script>
<style lang="scss">
[navbar] {
  background: rgba(112, 214, 255, 0.45);
  -webkit-backdrop-filter: blur(11px);
  backdrop-filter: blur(11px);
  border: 1px solid rgba(112, 214, 255, 0.225);
  box-shadow: 0px 2px 10px -2px #5a5a5a;
}
[bottom-navbar] {
  background: rgba(247, 247, 247, 0.7);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(247, 247, 247, 0.35);
  box-shadow: 0px 2px 10px -2px #5a5a5a;
}
[navbar-logo] {
  width: 60px;
  aspect-ratio: 1;
  padding: 7px;
  border-radius: 100%;
  background: #152e91;
}
[navbar-title] {
  font-size: calc(var(--c-font-size) * 1.5);
  color: $deep-purple-10;
  color: #001996;
  letter-spacing: 1px;
}
</style>
