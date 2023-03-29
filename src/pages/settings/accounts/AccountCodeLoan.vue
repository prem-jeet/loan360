<template>
  <div>
    <h1>Account code loan</h1>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { confirmDialog, onFailure, onSuccess } from 'src/utils/notification';
import { ref, reactive, computed, watch, watchEffect, onMounted } from 'vue';

interface AccountCodes {
  code: string;
  name: string;
  section: string;
  visible: string;
  vtype: string;
}

interface AccountHeads {
  id: number;
  name: string;
}

const fetchingData = ref(false);
const accountCodes = ref<AccountCodes[]>([]);
const accountHeads = ref<AccountHeads[]>([]);

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountCodeBySection/L');

  if (rsp.data) {
    accountCodes.value = rsp.data;
  }

  const rsp_ = await api.get('accountHead');

  if (rsp.data) {
    rsp_.data.filter((item: { id: number; name: string }) => {
      let obj = {
        id: item.id,
        name: item.name,
      };
      accountHeads.value.push(obj);
    });
    console.log(accountCodes.value);
    console.log(accountHeads.value);
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
