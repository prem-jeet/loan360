<template>
  <div class="flex flex-center">
    <div
      class="q-my-sm text-black flex items-center q-px-lg q-py-md"
      style="width: 80vw; border-radius: 5px"
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
          v-if="route.name !== 'moduleSelector'"
        />

        <div class="flex itens-center">
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
        <div>
          <q-btn
            class="row inline q-mr-sm gt-xs transparent"
            v-for="(item, index) in buttonOptions"
            :key="index"
            text-color="white"
            :icon="item.icon"
            padding="4px"
            size="10px"
            flat
          />
        </div>

        <RightMenuDropDown />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import RightMenuDropDown from 'src/components/RightMenuDropDown/RightMenuDropDown.vue';
import logo from 'src/assets/img/JaguarWhite.png';
import { useRoute } from 'vue-router';

import { useScreenSize } from 'src/composables/utilComposibles';
import { watch } from 'vue';

const emits = defineEmits(['openMenu']);
const route = useRoute();
const openMenu = () => emits('openMenu');

const buttonOptions = [
  {
    icon: 'email',
    label: 'Mails',
  },
  {
    icon: 'notifications',
    label: 'Notifications',
  },
  {
    icon: 'chat',
    label: 'Chat Room',
  },
  {
    icon: 'newspaper',
    label: 'newspaper News',
  },
];

const { screenWidth } = useScreenSize();
watch(screenWidth, () => console.log(screenWidth.value), { immediate: true });
</script>
<style lang="scss">
[navbar] {
  background: rgba(112, 214, 255, 0.45);
  -webkit-backdrop-filter: blur(11px);
  backdrop-filter: blur(11px);
  border: 1px solid rgba(112, 214, 255, 0.225);
  box-shadow: 0px 2px 10px -2px #5a5a5a;
}
[navbar-logo] {
  width: 70px;
  aspect-ratio: 1;
  background: #000;
  padding: 7px;
  border-radius: 100%;
  background: #000;
}
[navbar-title] {
  font-size: calc(var(--c-font-size) * 1.7);
  color: $deep-purple-10;
  letter-spacing: 1px;
}
</style>
