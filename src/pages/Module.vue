<template>
  <div class="absolute full-width full-height column flex-center" :key="module">
    <p class="text-medium" id="module-label">{{ currentModule }} Module</p>
    <div class="q-mt-lg">
      <q-btn
        color="dark"
        label="Open Menu"
        size="md"
        rounded
        push
        padding="sm lg"
        @click="openMenu"
      />
      <q-btn
        class="q-ml-lg"
        color="dark"
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['openMenu']);

const modules = {
  td: 'Term Deposit',
  lms: 'Loan Management System',
  los: 'Loan Origination System',
  fa: 'Financial Accounting',
  settings: 'Settings',
  maintenance: 'Maintenance',
  collection: 'Collection',
};

const currentModule = modules[props.module as keyof typeof modules];

const openMenu = () => emits('openMenu');

onMounted(() => {
  openMenu();
});
</script>

<style scoped>
#module-label {
  font-size: calc(2vw + 12px);
}
</style>
