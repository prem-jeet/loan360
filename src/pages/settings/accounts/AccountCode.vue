<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg">
      <div class="col">
        <q-table
          style="max-height: 83vh"
          :rows="accountCodes"
          :columns="columns"
          row-key="name"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          virtual-scroll
          title="Account codes"
          no-data-label="Select a section Loan/Deposit"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-deep-purple-10 text-white">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                style="font-size: 1.1rem"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div class="q-gutter-y-md">
              <p class="text-h4">Account codes</p>
              <div class="row items-center q-mt-lg">
                <div class="col-12 q-gutter-x-md flex items-center">
                  <span class="text-h6">Section</span>
                  <q-btn
                    v-if="accountCodes.length"
                    color="red"
                    label="clear"
                    @click="reset"
                    size="sm"
                  />
                </div>
                <div class="col-12">
                  <div class="q-gutter-lg">
                    <q-radio v-model="sectionCode" val="L" label="Loan" />
                    <q-radio v-model="sectionCode" val="D" label="Deposit" />
                  </div>
                </div>
              </div>
              <div class="row items-center q-gutter-x-md">
                <div class="col-12 q-mb-sm">
                  <span class="text-h6">Filter</span>
                </div>
                <div class="col-auto">
                  <q-input
                    v-model="codeSearchQuery"
                    outlined
                    clearable
                    dense
                    rounded
                    placeholder="By code"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-auto">
                  <q-input
                    v-model="nameSearchQuery"
                    outlined
                    clearable
                    dense
                    rounded
                    placeholder="By name"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-auto" v-if="codeSearchQuery && nameSearchQuery">
                  <q-btn
                    label="Clear"
                    color="red"
                    size="sm"
                    @click="
                      () => {
                        codeSearchQuery = '';
                        nameSearchQuery = '';
                      }
                    "
                  ></q-btn>
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, watch } from 'vue';

interface AccountCode {
  code: string;
  name: string;
  section: 'D' | 'L';
  visible: string | null;
  vtype: string | null;
}

const fetchAccountcodebySection = async (
  code: 'D' | 'L'
): Promise<AccountCode[] | []> => {
  const rsp = await api(`accountCodeBySection/${code}`);

  if (!rsp.data) {
    return [];
  }

  return rsp.data;
};

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code' },
];

const reset = () => {
  accountCodes.value = [];
  sectionCode.value = null;
};

const columns: {
  name: string;
  required: boolean;
  label: string;
  field: string;
  align: 'left';
  sortable: boolean;
}[] = [
  {
    name: 'code',
    required: true,
    label: 'Code',
    field: 'code',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'visible',
    required: true,
    label: 'Visible',
    field: 'visible',
    align: 'left',
    sortable: true,
  },
  {
    name: 'vType',
    required: true,
    label: 'voucher type',
    field: 'vtype',
    align: 'left',
    sortable: true,
  },
];

const sectionCode = ref(null);
const accountCodes = ref<AccountCode[] | []>([]);
const fetchingData = ref(false);
const codeSearchQuery = ref('');
const nameSearchQuery = ref('');

watch(sectionCode, async () => {
  if (sectionCode.value) {
    fetchingData.value = true;
    const rsp = await fetchAccountcodebySection(sectionCode.value);

    accountCodes.value = rsp;
    fetchingData.value = false;
  }
});
</script>

<style scoped></style>
