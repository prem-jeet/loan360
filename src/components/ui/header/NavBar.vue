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
          @click="openMenu"
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
        <RightMenuDropDown />
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
      @click="openMenu"
      v-if="!['moduleSelector', 'module'].includes(route.name as string)"
    />
    <router-link
      to="/"
      :class="[route.name === 'moduleSelector' ? 'text-blue-10' : 'text-black']"
    >
      <q-icon class="cursor-pointer" name="home" size="md" />
    </router-link>
    <q-icon class="cursor-pointer" name="notifications" size="md" />
    <q-icon class="cursor-pointer" name="person" size="md" />
  </div>
</template>
<script setup lang="ts">
import RightMenuDropDown from 'src/components/RightMenuDropDown/RightMenuDropDown.vue';
import logo from 'src/assets/img/jaguarlogo.png';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useQuasar } from 'quasar';

const emits = defineEmits(['openMenu']);
const route = useRoute();
const $q = useQuasar();
const screenWidth = computed(() => $q.screen.width);
const openMenu = () => emits('openMenu');
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
