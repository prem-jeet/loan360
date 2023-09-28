<template>
  <div class="flex flex-center">
    <div
      class="q-my-xs text-black flex items-center q-px-lg q-py-sm"
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
        <RightMenuDropDown />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import RightMenuDropDown from 'src/components/RightMenuDropDown/RightMenuDropDown.vue';
import logo from 'src/assets/img/jaguarlogo.png';
import { useRoute } from 'vue-router';

const emits = defineEmits(['openMenu']);
const route = useRoute();

const openMenu = () => emits('openMenu');
</script>
<style lang="scss">
[navbar] {
  // background: rgba(112, 214, 255, 0.45);
  // -webkit-backdrop-filter: blur(11px);
  // backdrop-filter: blur(11px);
  // border: 1px solid rgba(112, 214, 255, 0.225);
  box-shadow: 0px 2px 10px -2px #5a5a5a;
  background: rgba(148, 216, 255, 0.7);
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
  border: 1px solid rgba(84, 192, 255, 0.7);
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
