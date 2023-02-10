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
              v-model="company"
              :options="companyOptions"
              label="Company"
              :error="error && !company"
              error-message="select a company"
            />
            <q-select
              outlined
              v-model="branch"
              :options="branchOptions"
              label="Brach"
              :error="error && !branch"
              error-message="select a branch"
            />
            <q-select
              outlined
              v-model="financialYear"
              :options="financialYearOptions"
              label="Financial Year"
              :error="error && !financialYear"
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
import { useRoute } from 'vue-router';

const emit = defineEmits(['close']);
const route = useRoute();

const active = true;

const company = ref('');
const branch = ref('');
const financialYear = ref('');
const companyOptions = ref(['a', 'b']);
const branchOptions = ref(['a', 'b']);
const financialYearOptions = ref(['a', 'b']);

const error = ref(false);

watch([company, branch, financialYear], () => (error.value = false));

const submit = () => {
  if (!(company.value && branch.value && financialYear.value)) {
    error.value = true;
  }
  /* TODO: save the data and redirect to module selector page */
};

const close = () => {
  emit('close');
};

onMounted(() => {
  /* TODO: fetch the required data */
});
</script>

<style scoped></style>
