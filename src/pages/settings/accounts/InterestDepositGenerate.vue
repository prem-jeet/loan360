<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>
    <div class="q-mt-lg q-pb-xl">
      <div class="row justify-center q-py-lg q-mt-lg">
        <div class="col-5">
          <q-card>
            <q-card-section class="bg-grey-4 text-center">
              <span class="text-h4">Deposit Interest Updation</span>
            </q-card-section>
            <q-card-section>
              <div class="row q-gutter-lg justify-center q-py-lg">
                <div class="col-6">
                  <SearchableMultiselect
                    :max-chips="5"
                    chip-key="value"
                    label="Companies"
                    v-model="selectedCompanies"
                    :options="companyOptions"
                  />
                </div>
                <div class="col-6">
                  <SearchableMultiselect
                    :max-chips="5"
                    chip-key="value"
                    label="Branches"
                    v-model="selectedBranches"
                    :options="BranchOptions"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator inset />
            <q-card-actions align="center" class="q-py-md">
              <q-btn
                color="grey-10"
                label="submit"
                :disable="
                  !(selectedBranches.length && selectedCompanies.length)
                "
              />
              <q-btn color="red-10" label="reset" @click="resetSelection" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import SearchableMultiselect from 'src/components/SearchableMultiselect.vue';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { useUserStore } from 'src/stores/user/userStore';
import { ref, computed } from 'vue';

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  {
    path: '/module/settings/interestDepositGenerate',
    label: 'Deposite Interest Generate',
  },
];

type Option = { label: string; value: string };

const userStore = useUserStore();
const { allowedCompany, allowedBranch } = storeToRefs(userStore);

const companyOptions = computed(() =>
  allowedCompany.value.map((company) => ({
    label: company.name,
    value: company.code,
  }))
);
const BranchOptions = computed(() =>
  allowedBranch.value.map((branch) => ({
    label: branch.name,
    value: branch.code,
  }))
);

const selectedCompanies = ref<Option[]>([]);
const selectedBranches = ref<Option[]>([]);

const resetSelection = () => {
  selectedCompanies.value = [];
  selectedBranches.value = [];
};
</script>

<style scoped></style>
