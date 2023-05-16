<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredData"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :no-data-label="
            accountCodeDeposits.length
              ? 'No result found'
              : noDataLabel
              ? 'No result found'
              : 'Select a filter product and category'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredData.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="q-gutter-y-md q-pb-xs-md">
              <div class="row items-center q-gutter-md">
                <div class="col-auto text-h4">Account Code Deposit</div>
                <div class="col-auto">
                  <q-btn
                    v-if="showAddNew"
                    color="blue-7"
                    icon="add"
                    label="Add new"
                    size="md"
                    @click="newEntry()"
                  />
                </div>
              </div>

              <div class="row items-center q-gutter-x-md">
                <div class="col-12">
                  <span class="text-h6">Filter</span>
                  <span v-if="accountCodeDeposits.length" class="q-ml-md">
                    <q-btn
                      label="Clear"
                      color="red"
                      size="sm"
                      @click="resetAccountCodeDeposits"
                    ></q-btn
                  ></span>
                </div>
              </div>
            </div>

            <q-form
              class="full-width"
              @submit.prevent="loadAccountCodeDeposits"
            >
              <div class="row">
                <div class="col-xs-12 col-sm-3 col-md-2 q-pt-sm q-pr-sm">
                  <q-select
                    v-model="product"
                    dense
                    :options="getMultiSelectOptions_Util(products)"
                    map-options
                    emit-value
                    label="Select product"
                    outlined
                    hide-bottom-space
                    :rules="[(val) => !!val || '']"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="product"
                        name="close"
                        @click.stop.prevent="product = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-select>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-2 q-pt-sm q-pr-sm">
                  <q-select
                    v-model="category"
                    dense
                    :options="getMultiSelectOptions_Util(categorys)"
                    label="Select category"
                    outlined
                    map-options
                    emit-value
                    hide-bottom-space
                    :rules="[(val) => !!val || '']"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="category"
                        name="close"
                        @click.stop.prevent="category = ''"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-select>
                </div>
                <div class="col-xs-12 col-sm-2 col-md-2 q-pt-sm">
                  <q-btn color="primary" label="search" type="submit" />
                </div>
              </div>
            </q-form>
            <div class="row">
              <div class="col-12 q-py-sm">
                <q-checkbox
                  v-model="checkBox"
                  :disable="isApplicationCondition"
                  label="isApplication"
                />
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
                    @click="editEntry(props.row.id)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    @click="() => deleteEntry(props.row.id)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="accountCode" :props="props">
                {{
                  accountCodes.find(
                    (item) => item.value === props.row.accountCode
                  )!.label
                }}
              </q-td>
              <q-td key="accountId" :props="props">
                {{
                  accountHeads.find(
                    (item) => item.value === props.row.accountId
                  )!.label
                }}
              </q-td>
              <q-td
                key="isApplication"
                :props="props"
                auto-width
                style="min-width: 300px"
              >
                <q-checkbox v-model="props.row.isApplication" disable />
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Code :</div>
                    <div class="col-12">
                      {{
                        accountCodes.find(
                          (item) => item.value === props.row.accountCode
                        )!.label
                      }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Name :</div>
                    <div class="col-12">
                      {{
                        accountHeads.find(
                          (item) => item.value === props.row.accountId
                        )!.label
                      }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12">
                      <q-checkbox
                        v-model="props.row.isApplication"
                        disable
                        label="isApplication"
                      />
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions
                  align="center"
                  class="q-py-md bg-grey-2 q-mt-md"
                >
                  <q-btn
                    label="edit"
                    icon="edit"
                    size="sm"
                    color="teal"
                    @click="editEntry(props.row.id)"
                  >
                  </q-btn>
                  <q-btn
                    label="Delete"
                    icon="delete"
                    size="sm"
                    color="red"
                    @click="() => deleteEntry(props.row.id)"
                  >
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <q-dialog v-model="isEntryModalActive">
    <q-card style="width: 400px">
      <q-form @submit.prevent="saveEntry" @reset="setFormData()">
        <q-card-section class="bg-grey-2">
          <div class="row">
            <div class="col-10 items-center text-h6">
              {{
                mode === 'new'
                  ? 'Add account code deposit'
                  : 'Edit account code deposit'
              }}
            </div>
            <div class="col-2">
              <q-btn icon="close" flat @click="isEntryModalActive = false" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-sm">
          <div class="row">
            <div class="col-12">
              <div class="col-12 q-mt-lg">
                <q-select
                  v-if="mode === 'new'"
                  v-model="newCodeDeposit.productCode"
                  dense
                  :options="getMultiSelectOptions_Util(products)"
                  label="Select product"
                  map-options
                  emit-value
                  outlined
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="newCodeDeposit.productCode"
                      name="close"
                      @click.stop.prevent="newCodeDeposit.productCode = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-if="mode === 'new'"
                  v-model="newCodeDeposit.categoryCode"
                  dense
                  :options="getMultiSelectOptions_Util(categorys)"
                  label="Select category"
                  outlined
                  map-options
                  emit-value
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="newCodeDeposit.categoryCode"
                      name="close"
                      @click.stop.prevent="newCodeDeposit.categoryCode = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeDeposit.accountCode"
                  dense
                  :options="accountCodes"
                  label="Select Code"
                  outlined
                  map-options
                  emit-value
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="newCodeDeposit.accountCode"
                      name="close"
                      @click.stop.prevent="newCodeDeposit.accountCode = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeDeposit.accountId"
                  dense
                  use-input
                  map-options
                  emit-value
                  hide-dropdown-icon
                  :options="accountNameOptions"
                  label="Account name"
                  outlined
                  :rules="[(val) => val !== null || 'Please enter valid input']"
                  @input-value="loadAccountNames"
                  ref="dropdown"
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="newCodeDeposit.accountId"
                      name="close"
                      @click.stop.prevent="newCodeDeposit.accountId = null"
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>

              <div class="col-12 q-mt-sm">
                <q-checkbox
                  :disable="formCheckboxCondition"
                  v-model="newCodeDeposit.isApplication"
                  label="isApplication"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="center" class="q-py-md bg-grey-2 q-mt-auto">
          <q-btn
            padding="sm md"
            :label="editingRowId === null ? 'Add' : 'Save '"
            :icon="editingRowId === null ? 'add' : 'save '"
            color="teal"
            type="submit"
          />
          <q-btn
            padding="sm md"
            label="Reset"
            color="red-5"
            type="reset"
            icon="refresh"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { onSuccess, confirmDialog } from 'src/utils/notification';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { getMultiSelectOptions_Util } from 'src/utils/commonUtils';
import { useQuasar } from 'quasar';

interface AccountHeads {
  label: string;
  value: number;
}
interface AccountCodes {
  label: string;
  value: string;
}

interface AccountCodeDeposit {
  accountCode: string;
  categoryCode: string;
  id: number | null;
  isApplication: boolean;
  productCode: string;
  accountId: number | null;
}

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code Deposit' },
];

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

const newCodeDeposit = reactive<AccountCodeDeposit>({
  accountCode: '',
  categoryCode: '',
  id: null,
  isApplication: false,
  productCode: '',
  accountId: null,
});

const $q = useQuasar();
let mode: 'new' | 'edit' = 'new';
const checkBox = ref(false);
const isEntryModalActive = ref(false);
const fetchingData = ref(false);
const accountHeads = ref<AccountHeads[]>([]);
const accountNameOptions = ref<AccountHeads[]>([]);
const accountCodes = ref<AccountCodes[]>([]);
const product = ref('');
const category = ref('');
const accountCodeDeposits = ref<AccountCodeDeposit[]>([]);
const editingRowId = ref<number | null>(null);
const dropdown = ref(null);
const showAddNew = ref(false);
const noDataLabel = ref(false);

const products = {
  FD: 'Fixed Deposit',
  RD: 'Recurring Deposit',
  DD: 'Daily Deposit',
  DB: 'Debenture',
  SB: 'Sub-oridinate Debentures',
  FC: 'Fully Convertible Debentures',
};

const categorys = {
  S: 'Share Holders',
  D: 'Directors',
  O: 'Others',
  DR: "Director's Relatives",
};

const filteredData = computed(() =>
  accountCodeDeposits.value.filter(
    (item) => item.isApplication === checkBox.value
  )
);

// This for may change product in newform
const isApplicationCondition = computed(
  () =>
    product.value === 'FD' || product.value === 'RD' || product.value === 'DD'
);

const formCheckboxCondition = computed(
  () =>
    newCodeDeposit.productCode === 'FD' ||
    newCodeDeposit.productCode === 'RD' ||
    newCodeDeposit.productCode === 'DD'
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = accountCodeDeposits.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = accountCodeDeposits.value[index];
  }
  newCodeDeposit.accountCode = temp ? temp.accountCode : '';
  newCodeDeposit.accountId = temp ? temp.accountId : null;
  newCodeDeposit.isApplication = temp ? temp.isApplication : checkBox.value;
  newCodeDeposit.productCode = temp ? temp.productCode : product.value;
  newCodeDeposit.categoryCode = temp ? temp.categoryCode : category.value;
};

const newEntry = () => {
  mode = 'new';
  editingRowId.value = null;
  isEntryModalActive.value = true;
  accountNameOptions.value = [];
  setFormData();
};
const editEntry = (id: number) => {
  mode = 'edit';
  editingRowId.value = id;
  setFormData();
  isEntryModalActive.value = true;
};

const saveNewEntry = async () => {
  const tempObj = {
    accountCode: newCodeDeposit.accountCode,
    accountId: newCodeDeposit.accountId,
    categoryCode: newCodeDeposit.categoryCode,
    isApplication: newCodeDeposit.isApplication,
    productCode: newCodeDeposit.productCode,
  };
  const rsp = await api.post('accountCodeDeposit', tempObj);
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadAccountCodeDeposits();
    isEntryModalActive.value = false;
  }
};

const saveEdited = async () => {
  console.log('hi');
  const rsp = await api.get('accountHead');

  let headObj = rsp.data.filter((item: { id: number }) => {
    return item.id === newCodeDeposit.accountId;
  });

  const payLoad = {
    account: headObj[0],
    accountCode: newCodeDeposit.accountCode,
    accountId: newCodeDeposit.accountId,
    id: editingRowId.value,
    isApplication: newCodeDeposit.isApplication,
    productCode: newCodeDeposit.productCode,
    categoryCode: newCodeDeposit.categoryCode,
  };

  const rsp_ = await api.post('accountCodeDeposit', payLoad);
  if (rsp_.data && rsp_.data.displayMessage) {
    onSuccess({
      msg: rsp_.data.displayMessage,
      icon: 'sync_alt',
    });
    loadAccountCodeDeposits();
    isEntryModalActive.value = false;
  }
};

const saveEntry = () => {
  mode === 'new' ? saveNewEntry() : saveEdited();
};

const deleteEntry = (id: number) => {
  confirmDialog(() => deleteEntryConfirmed(id), {
    msg: 'Are you sure you want to delete ?',
  });
};

const deleteEntryConfirmed = async (id: number) => {
  const rsp = await api.delete(`accountCodeDeposit/${id}`);
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'delete' });

    loadAccountCodeDeposits();
  }
};

const loadAccountNames = (searchName: string) => {
  if (searchName.length > 1) {
    accountNameOptions.value = accountHeads.value.filter((item) => {
      return item.label.toLowerCase().includes(searchName.toLowerCase());
    });

    // @ts-expect-error function provided by component
    dropdown.value!.showPopup();
  } else {
    accountNameOptions.value = [];
  }
};
const resetAccountCodeDeposits = () => {
  accountCodeDeposits.value = [];
  product.value = '';
  category.value = '';
  checkBox.value = false;
  showAddNew.value = false;
};

const loadAccountCodeDeposits = async () => {
  fetchingData.value = true;
  const rsp = await api(
    `accountCodeDeposit/${product.value}/${category.value}`
  );
  if (rsp.data) {
    accountCodeDeposits.value = rsp.data;
    showAddNew.value = true;
    noDataLabel.value = accountCodeDeposits.value.length ? false : true;
  }
  fetchingData.value = false;
};

const loadAccountHeads = async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountHead');

  if (rsp.data) {
    accountHeads.value = rsp.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }
  fetchingData.value = false;
};

const loadAccountCodes = async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountCodeBySection/D');

  if (rsp.data) {
    accountCodes.value = rsp.data.map(
      (item: { code: string; name: string }) => ({
        value: item.code,
        label: item.name,
      })
    );
  }
  fetchingData.value = false;
};

watch(product, () => {
  if (
    product.value === 'FD' ||
    product.value === 'RD' ||
    product.value === 'DD'
  ) {
    checkBox.value = false;
  }
});

watch(newCodeDeposit, () => {
  if (newCodeDeposit.accountId) {
    accountNameOptions.value = accountHeads.value.filter((item) => {
      return item.value === newCodeDeposit.accountId;
    });
  }
});

onMounted(() => {
  loadAccountCodes();
  loadAccountHeads();
});
</script>

<style scoped></style>
