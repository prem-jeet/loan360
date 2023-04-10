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
                      v-if="showAddnew"
                      color="blue-7"
                      icon="add"
                      label="Add new"
                      size="md"
                      @click="newEntry()"
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
                <div class="col-xs-12 col-sm-4 col-md-4 q-pt-md">
                  <q-select
                    v-model="product"
                    dense
                    :options="products"
                    map-options
                    emit-value
                    label="Select product"
                    outlined
                    :error="errorProduct"
                    hide-bottom-space
                  />
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 q-pt-md">
                  <q-select
                    v-model="category"
                    dense
                    :options="categorys"
                    label="Select category"
                    outlined
                    map-options
                    emit-value
                    :error="errorCategory"
                    hide-bottom-space
                  />
                </div>
                <div class="col-xs-12 col-sm-2 col-md-2 q-pt-md">
                  <q-btn
                    color="primary"
                    label="search"
                    @click="searchDeposits"
                  />
                </div>
                <div
                  v-if="
                    product === 'FD' || product === 'RD' || product === 'DD'
                  "
                  class="col-12 q-ml-none q-pl-sm q-pt-sm"
                >
                  <q-checkbox
                    v-model="checkBox"
                    disable
                    label="isApplication"
                  />
                </div>

                <div v-else class="col-12 q-ml-none q-pl-sm q-pt-sm">
                  <q-checkbox
                    @click="loadWithisApplication()"
                    v-model="checkBox"
                    label="isApplication"
                  />
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
                    @click="editEntry(props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    @click="() => deleteEntry(props.rowIndex)"
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

                <q-card-actions align="right" class="q-py-md bg-grey-2">
                  <q-btn-group push unelevated>
                    <q-btn
                      icon="edit"
                      size="sm"
                      outline
                      color="accent"
                      @click="editEntry(props.rowIndex)"
                    >
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="delete"
                      size="sm"
                      outline
                      color="red"
                      @click="() => deleteEntry(props.rowIndex)"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <q-dialog v-model="isEntryModalActive">
    <q-card>
      <q-form @submit.prevent="saveEntry" @reset="setFormData()">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-bold q-mr-xl">{{
              mode === 'new'
                ? 'Add account code deposit'
                : 'Edit account code deposit'
            }}</span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isEntryModalActive = false"
            />
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
                  :options="products"
                  label="Select product"
                  map-options
                  menu-shrink
                  emit-value
                  outlined
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-if="mode === 'new'"
                  v-model="newCodeDeposit.categoryCode"
                  dense
                  :options="categorys"
                  label="Select category"
                  outlined
                  map-options
                  menu-shrink
                  emit-value
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                />
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
                  menu-shrink
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeDeposit.accountId"
                  dense
                  use-input
                  map-options
                  menu-shrink
                  emit-value
                  hide-dropdown-icon
                  :options="accountNameOptions"
                  label="Account name"
                  outlined
                  :rules="[(val) => val !== null]"
                  @input-value="loadAccountNames"
                  ref="dropdown"
                />
              </div>

              <div
                v-if="
                  newCodeDeposit.productCode === 'FD' ||
                  newCodeDeposit.productCode === 'RD' ||
                  newCodeDeposit.productCode === 'DD'
                "
                class="col-12 q-mt-sm"
              >
                <q-checkbox
                  disable
                  v-model="newCodeDeposit.isApplication"
                  label="isApplication"
                />
              </div>
              <div v-else class="col-12 q-mt-sm">
                <q-checkbox
                  v-model="newCodeDeposit.isApplication"
                  label="isApplication"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="right" class="q-py-md bg-grey-2">
          <q-btn label="save" color="green-5" type="submit" />
          <q-btn label="Reset" color="red-5" type="reset" />
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

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code Deposit' },
];

interface AccountHeads {
  label: string;
  value: number;
}
interface AccountCodes {
  label: string;
  value: string;
}

interface Options {
  value: string;
  label: string;
}
interface AccountCodeDeposit {
  accountCode: string;
  categoryCode: string;
  id: number | null;
  isApplication: boolean;
  productCode: string;
  accountId: number | null;
}

const newCodeDeposit = reactive<AccountCodeDeposit>({
  accountCode: '',
  categoryCode: '',
  id: null,
  isApplication: false,
  productCode: '',
  accountId: null,
});

let mode: 'new' | 'edit' = 'new';
const checkBox = ref(false);
const errorProduct = ref(false);
const errorCategory = ref(false);
const isEntryModalActive = ref(false);
const fetchingData = ref(false);
const accountHeads = ref<AccountHeads[]>([]);
const accountNameOptions = ref<AccountHeads[]>([]);
const accountCodes = ref<AccountCodes[]>([]);
const product = ref('');
const category = ref('');
const accountCodeDeposits = ref<AccountCodeDeposit[]>([]);
const accountCodeDepositsTemp = ref<AccountCodeDeposit[]>([]); // for isapplicable
const editingRowIndex = ref<number | null>(null);
const dropdown = ref(null);
const showAddnew = ref(false);

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

const setFormData = () => {
  let temp;
  if (editingRowIndex.value !== null) {
    temp = accountCodeDeposits.value[editingRowIndex.value];
  }
  newCodeDeposit.accountCode = temp ? temp.accountCode : '';
  newCodeDeposit.accountId = temp ? temp.accountId : null;
  newCodeDeposit.isApplication = temp ? temp.isApplication : checkBox.value;
  newCodeDeposit.productCode = temp ? temp.productCode : product.value;
  newCodeDeposit.categoryCode = temp ? temp.categoryCode : category.value;
};

const newEntry = () => {
  mode = 'new';
  editingRowIndex.value = null;
  isEntryModalActive.value = true;
  accountNameOptions.value = [];

  setFormData();
};
const editEntry = (index: number) => {
  mode = 'edit';
  editingRowIndex.value = index;
  accountNameOptions.value = [];
  setFormData(), (isEntryModalActive.value = true);
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
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadAccountCodeDeposits();
    isEntryModalActive.value = false;
  }
};

const saveEdited = async () => {
  const rsp = await api.get('accountHead');

  let headObj = rsp.data.filter((item: { id: number }) => {
    return (
      item.id === accountCodeDeposits.value[editingRowIndex.value!].accountId
    );
  });

  const payLoad = {
    account: headObj[0],
    accountCode: newCodeDeposit.accountCode,
    accountId: newCodeDeposit.accountId,
    id: accountCodeDeposits.value[editingRowIndex.value!].id,
    isApplication: newCodeDeposit.isApplication,
    productCode: newCodeDeposit.productCode,
    categoryCode: newCodeDeposit.categoryCode,
  };

  const rsp_ = await api.post('accountCodeDeposit', payLoad);
  if (rsp_.data) {
    onSuccess({
      msg: rsp_.data.displayMessage,
      icon: 'sync_alt',
    });
    loadAccountCodeDeposits();
    // accountCodeDeposits.value[index].accountCode = newCodeDeposit.accountCode;
    // accountCodeDeposits.value[index].accountId = newCodeDeposit.accountId;
    // accountCodeDeposits.value[index].isApplication =
    //   newCodeDeposit.isApplication;
    isEntryModalActive.value = false;
  }
};

const saveEntry = () => {
  mode === 'new' ? saveNewEntry() : saveEdited();
};

const deleteEntry = async (rowIndex: number) => {
  confirmDialog(() => deleteEntryConfirmed(rowIndex), {});
};

const deleteEntryConfirmed = async (rowIndex: number) => {
  const rsp = await api.delete(
    `accountCodeDeposit/${accountCodeDeposits.value[rowIndex].id}`
  );
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'delete' });

    accountCodeDeposits.value.splice(rowIndex, 1);
  }
};

const filteredNatureEntry = computed(() => {
  return accountCodeDeposits.value;
});
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
  accountCodeDepositsTemp.value = [];
  product.value = '';
  category.value = '';
  checkBox.value = false;
  showAddnew.value = false;
};

const searchDeposits = () => {
  if (product.value === '' || category.value === '') {
    errorProduct.value = true;
    errorCategory.value = true;
  } else {
    loadAccountCodeDeposits();
  }
};

const loadAccountCodeDeposits = async () => {
  const rsp = await api(
    `accountCodeDeposit/${product.value}/${category.value}`
  );
  if (rsp.data) {
    accountCodeDeposits.value = rsp.data.filter(
      (item: { isApplication: boolean }) => {
        return item.isApplication === checkBox.value;
      }
    );
    accountCodeDepositsTemp.value = rsp.data;
    showAddnew.value = true;
  }
};

const loadWithisApplication = () => {
  if (checkBox.value === true) {
    accountCodeDeposits.value = accountCodeDepositsTemp.value.filter((item) => {
      return item.isApplication === true;
    });
  }
  if (checkBox.value === false) {
    accountCodeDeposits.value = accountCodeDepositsTemp.value.filter((item) => {
      return item.isApplication === false;
    });
  }
};

watch(product, () => {
  if (
    product.value === 'FD' ||
    product.value === 'RD' ||
    product.value === 'DD'
  ) {
    checkBox.value = false;
  }
  if (product.value !== '') {
    errorProduct.value = false;
  }
});

watch(category, () => {
  if (category.value !== '') {
    errorCategory.value = false;
  }
});

watch(newCodeDeposit, () => {
  if (newCodeDeposit.accountId) {
    accountNameOptions.value = accountHeads.value.filter((item) => {
      return item.value === newCodeDeposit.accountId;
    });
  }
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountHead');

  if (rsp.data) {
    accountHeads.value = rsp.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }
  fetchingData.value = false;
});

onMounted(async () => {
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
});
</script>

<style scoped></style>
