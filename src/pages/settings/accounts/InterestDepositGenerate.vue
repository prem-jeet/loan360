<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>
    <div class="q-mt-lg q-pb-xl">
      <div class="row">
        <p class="text-h4">Deposit Interest Updation</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  {
    path: '/module/settings/interestDepositGenerate',
    label: 'Deposite Interest Generate',
  },
];
</script>

<style scoped></style>
