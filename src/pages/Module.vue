<template>
  <div
    class="absolute full-width full-height column flex-center"
    :key="module"
    v-if="route.name === 'module'"
  >
    <div class="col-auto text-center q-mt-md">
      <p class="text-medium" id="module-label">{{ moduleLabel }} Module</p>
    </div>

    <div
      class="col"
      :style="{
        width:
          screenWidth < 560 ? '90vw' : screenWidth < 1000 ? '70vw' : '50vw',
      }"
    >
      <LeftMenu :key="menuStore.currentModule" />
    </div>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { useMenuStore } from 'src/stores/menu/menuStore';
import { onMounted, computed } from 'vue';
import { Modules } from 'src/stores/menu/menuStoreTypes';

import LeftMenu from 'src/components/LeftMenu.vue';
import { useRoute } from 'vue-router';
import { useScreenSize } from 'src/composables/utilComposibles';

const props = defineProps<{
  module: Modules;
}>();
const { screenWidth } = useScreenSize();
const route = useRoute();

const menuStore = useMenuStore();

const modules = {
  td: { key: 'DEP', label: 'Term Deposit' },
  lms: { key: 'LMS', label: 'Loan Management System' },
  los: { key: 'LOS', label: 'Loan Origination System' },
  fa: { key: 'ACT', label: 'Financial Accounting' },
  settings: { key: 'SET', label: 'Settings' },
  maintenance: { key: 'MNT', label: 'Maintenance' },
  collection: { key: 'COL', label: 'Collection' },
};

const currentModule = computed(() => props.module);
const moduleLabel = modules[currentModule.value as keyof typeof modules].label;

onMounted(() => {
  menuStore.currentModule = modules[currentModule.value as keyof typeof modules]
    .key as Modules;
});
</script>

<style scoped>
#module-label {
  font-size: calc(2vw + 12px);
}
</style>
