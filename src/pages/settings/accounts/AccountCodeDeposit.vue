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
                      @click="isAddNewEntryModalActive = true"
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
                    label="Select product"
                    outlined
                    :error="product.value === ''"
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
                    :error="category.value === ''"
                    hide-bottom-space
                  />
                </div>
                <div class="col-xs-12 col-sm-2 col-md-2 q-pt-md">
                  <q-btn
                    color="primary"
                    label="search"
                    @click="loadAccountCodeDeposits"
                  />
                </div>
                <div
                  v-if="
                    product.value === 'FD' ||
                    product.value === 'RD' ||
                    product.value === 'DD'
                  "
                  class="col-12 q-ml-none q-pl-sm q-pt-sm"
                >
                  <q-checkbox
                    v-model="isApplication"
                    disable
                    label="isApplication"
                  />
                </div>

                <div v-else class="col-12 q-ml-none q-pl-sm q-pt-sm">
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
                <q-select
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="editAccountCode"
                  dense
                  :options="accountCodes"
                  label="Select Code"
                  outlined
                  :error="editAccountCode.value === ''"
                  hide-bottom-space
                />

                <span v-else>
                  {{
                    accountCodes.find(
                      (item) => item.value === props.row.accountCode
                    )!.label
                  }}</span
                >
              </q-td>
              <q-td key="accountId" :props="props">
                <q-select
                  class="q-pb-none"
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="editAccountName"
                  dense
                  use-input
                  hide-dropdown-icon
                  :options="accountNameOptions"
                  label="Account name"
                  outlined
                  :error="error"
                  @input-value="loadAccountNames"
                  ref="dropdown"
                />

                <span v-else>
                  {{
                    accountHeads.find(
                      (item) => item.value === props.row.accountId
                    )!.label
                  }}</span
                >
              </q-td>
              <q-td
                key="isApplication"
                :props="props"
                auto-width
                style="min-width: 300px"
              >
                <span v-if="isEditing && editingRowIndex === props.rowIndex">
                  <div
                    v-if="
                      product.value === 'FD' ||
                      product.value === 'RD' ||
                      product.value === 'DD'
                    "
                    class="col-12 q-mt-sm"
                  >
                    <q-checkbox
                      disable
                      v-model="editIsApplication"
                      label="isApplication"
                    />
                  </div>
                  <div v-else class="col-12 q-mt-sm">
                    <q-checkbox
                      v-model="editIsApplication"
                      label="isApplication"
                    />
                  </div>
                </span>

                <span v-else>
                  <q-checkbox v-model="props.row.isApplication" disable
                /></span>
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
                      <q-select
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="editAccountCode"
                        dense
                        :options="accountCodes"
                        label="Select Code"
                        outlined
                        :error="editAccountCode.value === ''"
                        hide-bottom-space
                      />

                      <span v-else>
                        {{
                          accountCodes.find(
                            (item) => item.value === props.row.accountCode
                          )!.label
                        }}</span
                      >
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Name :</div>
                    <div class="col-12">
                      <q-select
                        class="q-pb-none"
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="editAccountName"
                        dense
                        use-input
                        hide-dropdown-icon
                        :options="accountNameOptions"
                        label="Account name"
                        outlined
                        :error="error"
                        @input-value="loadAccountNames"
                        ref="dropdown"
                      />

                      <span v-else>
                        {{
                          accountHeads.find(
                            (item) => item.value === props.row.accountId
                          )!.label
                        }}</span
                      >
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12">
                      <span
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                      >
                        <div
                          v-if="
                            product.value === 'FD' ||
                            product.value === 'RD' ||
                            product.value === 'DD'
                          "
                          class="col-12 q-mt-sm"
                        >
                          <q-checkbox
                            disable
                            v-model="editIsApplication"
                            label="isApplication"
                          />
                        </div>
                        <div v-else class="col-12 q-mt-sm">
                          <q-checkbox
                            v-model="editIsApplication"
                            label="isApplication"
                          />
                        </div>
                      </span>

                      <span v-else>
                        <q-checkbox
                          v-model="props.row.isApplication"
                          disable
                          label="isApplication"
                      /></span>
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
                      v-if="!isEditing || editingRowIndex !== props.rowIndex"
                      @click="() => editEntry(props.rowIndex)"
                    >
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="delete"
                      size="sm"
                      outline
                      color="red"
                      v-if="!isEditing || editingRowIndex !== props.rowIndex"
                      @click="() => deleteEntry(props.rowIndex)"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="check"
                      size="sm"
                      outline
                      color="green-10"
                      v-if="isEditing && editingRowIndex === props.rowIndex"
                      @click="() => saveEdited(props.rowIndex)"
                    >
                      <q-tooltip>Save</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="close"
                      size="sm"
                      outline
                      color="red"
                      v-if="isEditing && editingRowIndex === props.rowIndex"
                      @click="isEditing = false"
                    >
                      <q-tooltip>Cancel</q-tooltip>
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
  <q-dialog v-model="isAddNewEntryModalActive">
    <q-card>
      <q-form @submit.prevent="saveNewEntry" @reset="resetNewEntryForm">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-h6 q-mr-xl">Add nature entry</span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isAddNewEntryModalActive = false"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-sm">
          <div class="row">
            <div class="col-12">
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="addNewProduct"
                  dense
                  :options="products"
                  label="Select product"
                  outlined
                  :error="addNewProduct.label === ''"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="addNewCategory"
                  dense
                  :options="categorys"
                  label="Select category"
                  outlined
                  :error="addNewCategory.value === ''"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="accountCode"
                  dense
                  :options="accountCodes"
                  label="Select Code"
                  outlined
                  :error="accountCode.value === ''"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="accountName"
                  dense
                  use-input
                  hide-dropdown-icon
                  :options="accountNameOptions"
                  label="Account name"
                  outlined
                  :error="accountNameBool"
                  @input-value="loadAccountNames"
                  ref="dropdown"
                />
              </div>

              <div
                v-if="
                  addNewProduct.value === 'FD' ||
                  addNewProduct.value === 'RD' ||
                  addNewProduct.value === 'DD'
                "
                class="col-12 q-mt-sm"
              >
                <q-checkbox
                  disable
                  v-model="addIsApplication"
                  label="isApplication"
                />
              </div>
              <div v-else class="col-12 q-mt-sm">
                <q-checkbox v-model="addIsApplication" label="isApplication" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="right" class="q-py-md bg-grey-2">
          <q-btn label="Add" color="green-5" type="submit" />
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
import { ref, onMounted, computed, watch } from 'vue';

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
  id: number;
  isApplication: boolean;
  productCode: string;
  accountId: number;
}
const error = ref(false);
const isAddNewEntryModalActive = ref(false);
const fetchingData = ref(false);
const accountHeads = ref<AccountHeads[]>([]);
const accountNameOptions = ref<AccountHeads[]>([]);
const accountCodes = ref<AccountCodes[]>([]);
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
const product = ref({ value: '', label: '' });
const category = ref({ value: '', label: '' });
const addNewProduct = ref({ value: '', label: '' });
const addNewCategory = ref({ value: '', label: '' });
const accountCode = ref({ value: '', label: '' });
const accountName = ref(accountHeads.value[0]);
const editAccountCode = ref({ value: '', label: '' });
const editAccountName = ref(accountHeads.value[0]);
const accountNameBool = ref(true);
const accountCodeDeposits = ref<AccountCodeDeposit[]>([]);
const accountCodeDepositsTemp = ref<AccountCodeDeposit[]>([]); // for isapplicable
const editingRowIndex = ref(0);
const isEditing = ref(false);
const isApplication = ref(false);
const addIsApplication = ref(false);
const editIsApplication = ref(false);
const dropdown = ref(null);

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

const saveNewEntry = async () => {
  const tempObj = {
    accountCode: accountCode.value.value,
    accountId: accountName.value.value,
    categoryCode: addNewCategory.value.value,
    isApplication: addIsApplication.value,
    productCode: addNewProduct.value.value,
  };
  const rsp = await api.post('accountCodeDeposit', tempObj);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadAccountCodeDeposits();
    isAddNewEntryModalActive.value = false;
  }
};
const resetNewEntryForm = () => {
  addNewCategory.value.label = '';
  addNewCategory.value.value = '';
  addNewProduct.value.label = '';
  addNewProduct.value.value = '';
  accountCode.value.label = '';
  accountCode.value.value = '';
  accountName.value.label = '';
  accountName.value.value = 0;
  addIsApplication.value = false;
};

const editEntry = (rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(() => editEntryConfirmed(rowIndex), {
      msg: 'Are you sure you want to cancel editing the current Code?',
    });
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(rowIndex);
  }
};
const editEntryConfirmed = (index: number) => {
  editingRowIndex.value = index;
  const row: AccountCodeDeposit = accountCodeDeposits.value[index];

  let tempCode: AccountCodes[] = accountCodes.value.filter((item) => {
    return item.value === row.accountCode;
  });
  editAccountCode.value = tempCode[0];
  let tempName: AccountHeads[] = accountHeads.value.filter((item) => {
    return item.value === row.accountId;
  });
  editAccountName.value = tempName[0];
  editIsApplication.value = accountCodeDeposits.value[index].isApplication;
};
const saveEdited = async (index: number) => {
  if (editAccountName.value) {
    const row: AccountCodeDeposit = accountCodeDeposits.value[index];

    const rsp = await api.get('accountHead');

    let headObj = rsp.data.filter((item: { id: number }) => {
      return item.id === row.accountId;
    });

    const payLoad = {
      account: headObj[0],
      accountCode: editAccountCode.value.value,
      accountId: editAccountName.value.value,
      categoryCode: row.categoryCode,
      id: row.id,
      isApplication: false,
      productCode: row.productCode,
    };

    const rsp_ = await api.post('accountCodeDeposit', payLoad);
    if (rsp_.data) {
      onSuccess({
        msg: rsp_.data.displayMessage,
        icon: 'sync_alt',
      });
      accountCodeDeposits.value[index].accountCode =
        editAccountCode.value.value;
      accountCodeDeposits.value[index].accountId = editAccountName.value.value;
      accountCodeDeposits.value[index].isApplication = editIsApplication.value;
      console.log(accountCodeDeposits.value);

      isEditing.value = false;
    }
  } else {
    error.value = true;
  }
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
};
const loadAccountCodeDeposits = async () => {
  isApplication.value = false;

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
    console.log(accountCodeDeposits.value, 'hhh');
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

watch(product, () => {
  if (
    product.value.value === 'FD' ||
    product.value.value === 'RD' ||
    product.value.value === 'DD'
  ) {
    isApplication.value = false;
  }
});
watch(addNewProduct, () => {
  if (
    addNewProduct.value.value === 'FD' ||
    addNewProduct.value.value === 'RD' ||
    addNewProduct.value.value === 'DD'
  ) {
    addIsApplication.value = false;
  }
});
watch(accountName, () => {
  if (accountName.value) {
    accountNameBool.value = false;
  } else {
    accountNameBool.value = true;
  }
});
watch(editAccountName, () => {
  if (editAccountName.value) {
    error.value = false;
  } else {
    error.value = true;
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
        value: item.code,
        label: item.name,
      })
    );
    console.log(accountCodes.value);
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
