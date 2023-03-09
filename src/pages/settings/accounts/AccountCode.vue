<template>
  <div class="absolute q-pa-md full-width full-height">
    <q-chip outline square size="lg" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code' },
];
</script>

<style scoped></style>
