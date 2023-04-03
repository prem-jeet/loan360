<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted } from 'vue';

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code Deposit' },
];
const fetchingData = ref(false);

interface Accountheads {
  name: string;
  accountType: string;
}

const accountHeads = ref<Accountheads[]>([]);
onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountHead');

  if (rsp.data) {
    accountHeads.value = rsp.data.map(
      (item: { accountType: string; name: string }) => ({
        accountType: item.accountType,
        name: item.name,
      })
    );
    console.log(accountHeads.value);
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
