<template>
  <div>
    <Teleport to="body">
      <q-dialog v-model="active" position="standard">
        <q-card
          class="q-pa-sm q-pa-md-md"
          :style="{ minWidth: 'clamp(250px,85vw,500px)' }"
        >
          <q-form greedy class="column q-gutter-lg" @submit.prevent="submit">
            <q-select
              autofocus
              outlined
              v-model="selectedCompany"
              :options="userStore.allowedCompany"
              option-value="code"
              option-label="name"
              label="Company"
              :error="error && !selectedCompany"
              error-message="select a company"
              @update:model-value="userStore.fetchAllowedFinancialYear"
              behavior="menu"
            />
            <q-select
              outlined
              v-model="selectedBranch"
              :options="userStore.allowedBranch"
              option-value="code"
              option-label="name"
              label="Branch"
              :error="error && !selectedBranch"
              error-message="select a branch"
              behavior="menu"
            />
            <q-select
              outlined
              v-model="selectedFinancialYear"
              :options="userStore.allowedFinancialYear"
              option-value="name"
              option-label="name"
              label="Financial Year"
              :error="error && !selectedFinancialYear"
              error-message="select a financial year"
              behavior="menu"
            />
            <div class="q-pb-md flex flex-center">
              <q-btn label="Submit" type="submit" outline color="blue" />
              <q-btn
                v-if="route.name !== 'authenticated'"
                class="q-ml-lg"
                label="Close"
                type="button"
                @click="close"
              />
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { useUserStore } from 'src/stores/user/userStore';
import { Branch, Company, FinancialYear } from 'src/stores/user/userStoreTypes';
import { onSuccess } from 'src/utils/notification';

const emit = defineEmits(['close']);

const route = useRoute();

const userStore = useUserStore();

const active = true;

const selectedCompany = ref<Company | null>(null);
const selectedBranch = ref<Branch | null>(null);
const selectedFinancialYear = ref<FinancialYear | null>(null);
const error = ref(false);

const submit = () => {
  if (
    !(
      selectedCompany.value &&
      selectedBranch.value &&
      selectedFinancialYear.value
    )
  ) {
    error.value = true;
    return;
  }

  userStore.saveCompanyDetails(
    selectedCompany.value,
    selectedBranch.value,
    selectedFinancialYear.value
  );
  onSuccess({
    msg: 'Saved successfully',
  });
  userStore.openCompanySelectModal(false);
  setTimeout(close, 250);
};

const close = () => {
  emit('close');
};

watch(
  [selectedCompany, selectedBranch, selectedFinancialYear],
  () => (error.value = false)
);
const getDataOnRefresh = () => {
  // Header Set for loggedIn user
  if (userStore.token && userStore.token.id_token) {
    userStore.setAuthHeader(userStore.token.id_token);
  } else {
    userStore.setAuthHeader('');
  }
};
onBeforeMount(() => {
  getDataOnRefresh();
});

onMounted(async () => {
  if (!(userStore.allowedCompany.length && userStore.allowedBranch.length)) {
    await userStore.fetchAllowedCompany();
    await userStore.fetchAllowedBranch();
  }
  selectedCompany.value = userStore.selectedCompany;
  selectedBranch.value = userStore.selectedBranch;
  selectedFinancialYear.value = userStore.selectedFinancialYear;
});
</script>

<style scoped></style>
