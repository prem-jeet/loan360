<template>
  <div>
    <Teleport to="body">
      <q-dialog v-model="active" position="standard">
        <q-card
          class="q-pa-sm q-pa-md-md"
          :style="{ minWidth: 'clamp(250px,calc(50vw),500px)' }"
        >
          <q-form greedy class="column q-gutter-lg" @submit.prevent="submit">
            <q-select
              autofocus
              outlined
              v-model="selectedCompany"
              :options="company"
              option-value="code"
              option-label="name"
              label="Company"
              :error="error && !selectedCompany"
              error-message="select a company"
              @update:model-value="fetchFinancialYear"
            />
            <q-select
              outlined
              v-model="selectedBranch"
              :options="branch"
              option-value="code"
              option-label="name"
              label="Brach"
              :error="error && !selectedBranch"
              error-message="select a branch"
            />
            <q-select
              outlined
              v-model="selectedFinancialYear"
              :options="financialYear"
              option-value="name"
              option-label="name"
              label="Financial Year"
              :error="error && !selectedFinancialYear"
              error-message="select a financial year"
            />
            <div class="q-mt-lg">
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn
                v-if="route.name !== 'login'"
                class="q-ml-lg"
                label="Close"
                type="button"
                color="grey-13"
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
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCompanySelectorStore } from 'src/stores/companySelectoreStore';

const emit = defineEmits(['close']);

const route = useRoute();
const router = useRouter();
const companySelectorStore = useCompanySelectorStore();

const active = true;

const { company, branch, financialYear } = storeToRefs(companySelectorStore);
const selectedCompany = ref(null);
const selectedBranch = ref(null);
const selectedFinancialYear = ref(null);
const error = ref(false);

const fetchFinancialYear = ({ code }: { code: string }) => {
  companySelectorStore.fetchFinancialYear(code);
};

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

  companySelectorStore.setSelectedData(
    {
      selectedCompany: selectedCompany.value,
      selectedBranch: selectedBranch.value,
      selectedFinancialYear: selectedFinancialYear.value,
    },
    // replace => redirect to module selector
    () => router.push({ name: 'login' })
  );
};

const close = () => {
  emit('close');
};

watch(
  [selectedCompany, selectedBranch, selectedFinancialYear],
  () => (error.value = false)
);

onMounted(async () => {
  companySelectorStore.fetchData();
});
</script>

<style scoped></style>
