<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredNatureEntry"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :no-data-label="
            accountCodeDepositsTemp.length
              ? 'No result found'
              : 'Select a filter product and category'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredNatureEntry.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Account Code Deposit</div>
                  <div class="col-auto">
                    <q-btn
                      color="blue-7"
                      icon="add"
                      label="Add new"
                      size="md"
                    />
                  </div>
                </div>
              </div>
              <div class="row items-center q-gutter-x-md">
                <div class="col-12 q-mb-sm">
                  <span class="text-h6">Filter</span>
                  <span v-if="accountCodeDepositsTemp.length" class="q-ml-md">
                    <q-btn
                      label="Clear"
                      color="red"
                      size="sm"
                      @click="resetAccountCodeDeposits"
                    ></q-btn
                  ></span>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 q-pt-sm">
                  <q-select
                    v-model="product"
                    dense
                    :options="products"
                    label="Select product"
                    outlined
                    :error="error && !product"
                    hide-bottom-space
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-4 q-pt-sm">
                  <q-select
                    v-model="category"
                    dense
                    :options="categorys"
                    label="Select category"
                    outlined
                    :error="error && !category"
                    hide-bottom-space
                  />
                </div>
                <div class="col-xs-12 col-sm-12 col-md-2 q-pt-sm">
                  <q-btn
                    color="primary"
                    label="search"
                    @click="loadAccountCodeDeposits"
                  />
                </div>
                <div
                  v-if="
                    product.value !== 'FD' &&
                    product.value !== 'RD' &&
                    product.value !== 'DD'
                  "
                  class="col-12 q-ml-none q-pl-sm q-pt-sm"
                >
                  <q-checkbox v-model="isApplication" label="isApplication" />
                </div>
              </div>
            </div>
          </template>

          <template v-slot:header-cell="props">
            <q-th :props="props" style="font-size: 1rem">
              {{ props.col.label }}
            </q-th>
          </template>

          <!-- row design for screens > 800px-->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="actions" auto-width>
                <q-btn-group push unelevated>
                  <q-btn
                    icon="edit"
                    size="xs"
                    outline
                    color="accent"
                    v-if="!isEditing || editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    v-if="!isEditing || editingRowIndex !== props.rowIndex"
                    @click="() => deleteEntry(props.rowIndex)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="isEditing && editingRowIndex === props.rowIndex"
                    @click="() => saveEdited(props.rowIndex)"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="isEditing && editingRowIndex === props.rowIndex"
                    @click="isEditing = false"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="accountCode" :props="props">
                <span>
                  {{
                    accountCodes.find(
                      (item) => item.code === props.row.accountCode
                    )!.name
                  }}</span
                >
              </q-td>
              <q-td key="accountId" :props="props">
                <!-- <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="editingData.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="editingData.name ? 'green' : 'red'"
                  autofocus
                /> -->
                <span>{{
                  accountHeads.find((item) => item.id === props.row.accountId)!
                    .name
                }}</span>
              </q-td>
              <q-td
                key="isApplication"
                :props="props"
                auto-width
                style="min-width: 300px"
              >
                <!-- <q-select
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  dense
                  outlined
                  v-model="editingData.section"
                  :options="sectionSelectOptions"
                />-->
                <span>
                  <q-checkbox v-model="props.row.isApplication" disable
                /></span>
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <!-- <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section class="flex items-center">
                  <span class="text-weight-bold">{{ props.key }}</span>
                  <q-space />
                  <q-btn-group push unelevated>
                    <q-btn
                      icon="edit"
                      size="xs"
                      outline
                      color="accent"
                      v-if="!isEditing || editingRowIndex !== props.rowIndex"
                      @click="() => editEntry(props.rowIndex)"
                    >
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="delete"
                      size="xs"
                      outline
                      color="red"
                      v-if="!isEditing || editingRowIndex !== props.rowIndex"
                      @click="() => deleteEntry(props.rowIndex)"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="check"
                      size="xs"
                      outline
                      color="green-10"
                      v-if="isEditing && editingRowIndex === props.rowIndex"
                      @click="() => saveEdited(props.rowIndex)"
                    >
                      <q-tooltip>Save</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="close"
                      size="xs"
                      outline
                      color="red"
                      v-if="isEditing && editingRowIndex === props.rowIndex"
                      @click="isEditing = false"
                    >
                      <q-tooltip>Cancel</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      <template v-if="!isEditing">
                        {{ props.row.name }}
                      </template>
                      <q-input
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="editingData.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="editingData.name ? 'green' : 'red'"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Section :</div>
                    <div class="col-12">
                      <template v-if="!isEditing">
                        {{ props.row.section }}
                      </template>
                      <q-select
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        dense
                        outlined
                        v-model="editingData.section"
                        :options="sectionSelectOptions"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template> -->
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch } from 'vue';

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code Deposit' },
];

interface AccountHeads {
  name: string;
  id: number;
}
interface AccountCodes {
  name: string;
  code: string;
}

interface Options {
  value: string;
  label: string;
}
interface AccountCodeDeposit {
  accountCode: string;
  categoryCode: string;
  id: number;
  isApplication: boolean;
  productCode: string;
}
const fetchingData = ref(false);
const accountHeads = ref<AccountHeads[]>([]);
const accountCodes = ref<AccountCodes[]>([]);
const error = ref(false);
const products = ref<Options[]>([
  { value: 'FD', label: 'Fixed Deposit' },
  { value: 'RD', label: 'Recurring Deposit' },
  { value: 'DD', label: 'Daily Deposit' },
  { value: 'DB', label: 'Debenture' },
  { value: 'SB', label: 'Sub-oridinate Debentures' },
  { value: 'FC', label: 'Fully Convertible Debentures' },
]);

const categorys = ref<Options[]>([
  { value: 'S', label: 'Share Holders' },
  { value: 'D', label: 'Directors' },
  { value: 'O', label: 'Others' },
  { value: 'DR', label: "Director's Relatives" },
]);
const product = ref(products.value[0]);
const category = ref(categorys.value[0]);
const accountCodeDeposits = ref<AccountCodeDeposit[]>([]);
const accountCodeDepositsTemp = ref<AccountCodeDeposit[]>([]);
const editingRowIndex = ref(0);
const isEditing = ref(false);
const isApplication = ref(false);

const columns: {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align: 'left';
}[] = [
  {
    name: 'actions',
    label: 'Actions',
    align: 'left',
    field: '',
  },
  {
    name: 'accountCode',
    required: true,
    align: 'left',
    field: 'code',
    label: 'Account Code',
  },
  {
    name: 'accountId',
    required: true,
    align: 'left',
    field: 'name',
    label: 'Account Name',
  },
  {
    name: 'isApplication',
    required: true,
    align: 'left',
    field: 'isApplication',
    label: 'Is Application',
  },
];

const editEntry = (index: number) => {
  console.log('hi', index);
};

const deleteEntry = (index: number) => {
  console.log('hi', index);
};
const saveEdited = (index: number) => {
  console.log('hi', index);
};
const filteredNatureEntry = computed(() => {
  return accountCodeDeposits.value;
});

const resetAccountCodeDeposits = () => {
  accountCodeDeposits.value = [];
  accountCodeDepositsTemp.value = [];
};
const loadAccountCodeDeposits = async () => {
  isApplication.value = false;
  if (product.value.value === '' || category.value.value === '') {
    error.value = true;
  } else {
    const rsp = await api(
      `accountCodeDeposit/${product.value.value}/${category.value.value}`
    );
    if (rsp.data) {
      accountCodeDeposits.value = rsp.data.filter(
        (item: { isApplication: boolean }) => {
          return item.isApplication === false;
        }
      );
      accountCodeDepositsTemp.value = rsp.data;
      console.log(accountCodeDeposits.value);
    }
  }
};

watch(isApplication, () => {
  if (isApplication.value === true) {
    accountCodeDeposits.value = accountCodeDepositsTemp.value.filter((item) => {
      return item.isApplication === true;
    });
  }
  if (isApplication.value === false) {
    accountCodeDeposits.value = accountCodeDepositsTemp.value.filter((item) => {
      return item.isApplication === false;
    });
  }
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountHead');

  if (rsp.data) {
    accountHeads.value = rsp.data.map((item: { id: number; name: string }) => ({
      id: item.id,
      name: item.name,
    }));
    console.log(accountHeads.value);
  }
  fetchingData.value = false;
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountCodeBySection/D');

  if (rsp.data) {
    accountCodes.value = rsp.data.map(
      (item: { code: string; name: string }) => ({
        code: item.code,
        name: item.name,
      })
    );
    console.log(accountCodes.value);
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
