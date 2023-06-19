<template>
  <div
    class="absolute full-width full-height column"
    :class="[$q.platform.is.mobile ? mobileClass : 'flex-center']"
    :key="module"
    v-if="route.name === 'module'"
  >
    <div class="col-auto text-center">
      <p class="text-medium" id="module-label">{{ moduleLabel }} Module</p>
    </div>

    <div class="col" v-if="$q.platform.is.mobile">
      <LeftMenu :key="menuStore.currentModule" />
    </div>

    <div class="q-mt-lg" v-else>
      <q-btn
        class="brand-btn"
        glossy
        label="Open Menu"
        size="md"
        rounded
        push
        padding="sm lg"
        @click="openMenu"
      />
      <q-btn
        class="q-ml-lg brand-btn"
        glossy
        icon="home"
        size="md"
        rounded
        push
        padding="sm lg"
        :to="{ name: 'moduleSelector' }"
      >
        <q-tooltip> Module Selector </q-tooltip>
      </q-btn>
    </div>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { useMenuStore } from 'src/stores/menu/menuStore';
import { onMounted, computed } from 'vue';
import { Modules } from 'src/stores/menu/menuStoreTypes';
import { useQuasar } from 'quasar';
import LeftMenu from 'src/components/LeftMenu.vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  module: Modules;
}>();

const mobileClass = 'items-stretch q-pt-lg';
const route = useRoute();
const emits = defineEmits(['openMenu']);
const $q = useQuasar();

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

const openMenu = () => emits('openMenu');

onMounted(() => {
  menuStore.currentModule = modules[currentModule.value as keyof typeof modules]
    .key as Modules;

  if (!$q.platform.is.mobile && route.name === 'module') {
    openMenu();
  }
});
</script>

<style scoped>
#module-label {
  font-size: calc(2vw + 12px);
}
</style>
