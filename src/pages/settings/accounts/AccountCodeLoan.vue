<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredAccountCode"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Account codes"
          :no-data-label="
            accountCodeLoan.length
              ? 'No result found'
              : 'Select a section Loan/Laon Against Property/Personal Loan'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredAccountCode.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div class="q-gutter-y-md q-pb-xs-md">
              <div class="row items-center q-gutter-md">
                <div class="col-auto text-h4">Account code loan</div>
                <div class="col-auto">
                  <q-btn
                    size="md"
                    v-if="showNew"
                    label="Add Account code loan"
                    icon="add"
                    color="blue-7"
                    @click="
                      (mode = 'new'), setFormData(), (isEntryModalActive = true)
                    "
                  />
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-12 q-gutter-x-md flex items-center">
                  <span class="text-h6">Section</span>
                  <q-btn
                    v-if="accountCodeLoan.length"
                    color="red"
                    label="clear"
                    size="sm"
                    @click="resetAccountCodeLoanSection"
                  />
                </div>
                <div class="col-12">
                  <div class="q-gutter-lg q-mt-sm">
                    <q-radio
                      class="q-mt-none"
                      v-model="newCodeLoan.accountingCategoryCode"
                      val="L"
                      label="Loan"
                    />
                    <q-radio
                      class="q-mt-none"
                      v-model="newCodeLoan.accountingCategoryCode"
                      val="LAP"
                      label="Loan Against Property"
                    />
                    <q-radio
                      class="q-mt-none"
                      v-model="newCodeLoan.accountingCategoryCode"
                      val="PL"
                      label="Personal Loan"
                    />
                  </div>
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
                    @click="
                      (mode = 'edit'),
                        setFormData(),
                        (isEntryModalActive = true),
                        (editingRowIndex = props.rowIndex)
                    "
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
                    (item) => item.code === props.row.accountCode
                  )!.name
                }}
              </q-td>
              <q-td key="id" :props="props">
                {{
                  accountHeads.find((item) => item.id === props.row.accountId)!
                    .name
                }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->

          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account code :</div>
                    <div class="col-12">
                      {{
                        accountCodes.find(
                          (item) => item.code === props.row.accountCode
                        )!.name
                      }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Name :</div>
                    <div class="col-12">
                      {{
                        accountHeads.find(
                          (item) => item.id === props.row.accountId
                        )!.name
                      }}
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
                      @click="
                        (mode = 'edit'),
                          setFormData(),
                          (isEntryModalActive = true),
                          (editingRowIndex = props.rowIndex)
                      "
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

  <!--Add and Edit-->

  <q-dialog v-model="isEntryModalActive" @show="loadAccountCodes">
    <q-card>
      <q-form @submit.prevent="saveEntry" @reset="setFormData()">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-bold q-mr-xl"
              >{{
                mode === 'new'
                  ? 'Add account code loan'
                  : 'Edit account code loan'
              }}
            </span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isEntryModalActive = false"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-md">
          <div class="row">
            <div class="col-12">
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeLoan.accountCode"
                  :options="accountCodeOptions"
                  label="Account Code"
                  outlined
                  emit-value
                  map-options
                  menu-shrink
                  :rules="[(val) => !!val || '']"
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeLoan.accountId"
                  use-input
                  hide-dropdown-icon
                  :options="accountHeadOptions"
                  label="Account name"
                  outlined
                  emit-value
                  map-options
                  menu-shrink
                  @input-value="loadAccountHeads"
                  ref="dropdown"
                  :rules="[(val) => !!val || '']"
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
import { confirmDialog, onSuccess, onFailure } from 'src/utils/notification';
import { ref, computed, watch, onMounted, reactive } from 'vue';

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

interface AccountCodeOptions {
  value: string;
  label: string;
}
interface AccountHeadOptions {
  value: number;
  label: string;
}

interface AccountCodeLoan {
  id: number | null;
  accountCode: string;
  accountId: number | null;
  accountingCategoryCode: 'L' | 'LAP' | 'PL' | null;
}
const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/natureEntry', label: 'Account Code Loan' },
];
const fetchingData = ref(false);
const accountCodes = ref<AccountCodes[]>([]);
const accountHeads = ref<AccountHeads[]>([]);
const accountCodeLoan = ref<AccountCodeLoan[]>([]);
const accountCodeOptions = ref<AccountCodeOptions[]>([]);
const accountHeadOptions = ref<AccountHeadOptions[]>([]);
const dropdown = ref(null);
const editingRowIndex = ref(0);
const isEntryModalActive = ref(false);
const showNew = ref(false);
let mode: 'new' | 'edit' = 'new';
const newCodeLoan = reactive<AccountCodeLoan>({
  id: null,
  accountCode: '',
  accountId: null,
  accountingCategoryCode: null,
});

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
    field: 'accountCode',
    label: 'Account Code',
  },
  {
    name: 'id',
    required: true,
    align: 'left',
    field: 'id',
    label: 'Account Name',
  },
];

const filteredAccountCode = computed(() => {
  return accountCodeLoan.value;
});

const setFormData = () => {
  if (mode === 'new') {
    (newCodeLoan.accountCode = ''), (newCodeLoan.accountId = null);
  } else {
    newCodeLoan.accountCode =
      accountCodeLoan.value[editingRowIndex.value].accountCode;
    newCodeLoan.accountId =
      accountCodeLoan.value[editingRowIndex.value].accountId;
  }
};

const loadAccountHeads = async (value: string) => {
  let payLoad = {
    pageNo: 1,
    pageSize: 100,
    where:
      " c.name ilike '%" +
      value +
      "%' and inactive <> true and ( 1 = 1  and  1 = 1 )",
  };
  if (value.length > 1) {
    const rsp = await api.post('accountHead/typeahead/name', payLoad);
    if (rsp.data) {
      const options = rsp.data.map((item: { id: number; name: string }) => ({
        value: item.id,
        label: item.name,
      }));

      accountHeadOptions.value = options;
      // @ts-expect-error function provided by component
      dropdown.value!.showPopup();
    }
  } else {
    accountHeadOptions.value = [];
  }
};
const loadAccountCodes = () => {
  const options = accountCodes.value.map((item) => ({
    value: item.code,
    label: item.name,
  }));
  accountCodeOptions.value = options;
};

const saveNewEntry = async () => {
  const tempVal = accountCodeLoan.value.filter((item) => {
    return item.accountCode === newCodeLoan.accountCode;
  });
  if (tempVal.length) {
    onFailure({
      msg: 'Duplicate Account Found',
      icon: 'warning',
    });
  } else {
    const payLoad = {
      accountCode: newCodeLoan.accountCode,
      accountId: newCodeLoan.accountId,
      accountingCategoryCode: newCodeLoan.accountingCategoryCode,
    };

    const rsp = await api.post('accountCodeLoan', payLoad);
    if (rsp.data) {
      onSuccess({ msg: rsp.data.displayMessage, icon: 'check' });
      accountCodeLoan.value.push({
        ...payLoad,
        id: rsp.data.id,
      });
      isEntryModalActive.value = false;
    }
  }
};

const saveEdited = async () => {
  const payLoad = {
    accountCode: newCodeLoan.accountCode,
    accountId: newCodeLoan.accountId,
    accountingCategoryCode: newCodeLoan.accountingCategoryCode,
    id: accountCodeLoan.value[editingRowIndex.value].id,
  };

  const rsp = await api.post('accountCodeLoan', payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'check' });
    accountCodeLoan.value[editingRowIndex.value].accountCode =
      newCodeLoan.accountCode;

    accountCodeLoan.value[editingRowIndex.value].accountId =
      newCodeLoan.accountId;
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
    `accountCodeLoan/${accountCodeLoan.value[rowIndex].id}`
  );
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'delete' });

    accountCodeLoan.value.splice(rowIndex, 1);
  }
};

const resetAccountCodeLoanSection = () => {
  accountCodeLoan.value = [];
  newCodeLoan.accountingCategoryCode = null;
  showNew.value = false;
};

watch(newCodeLoan, async () => {
  if (newCodeLoan.accountingCategoryCode) {
    fetchingData.value = true;
    const rsp = await api(
      `accountCodeLoanByAccountingCategory/${newCodeLoan.accountingCategoryCode}`
    );
    accountCodeLoan.value = rsp.data;
    showNew.value = true;
    fetchingData.value = false;
  }
});

watch(newCodeLoan, async () => {
  if (newCodeLoan.accountId) {
    const options = accountHeads.value.map(
      (item: { id: number; name: string }) => ({
        value: item.id,
        label: item.name,
      })
    );
    accountHeadOptions.value = options.filter((item) => {
      return item.value === newCodeLoan.accountId;
    });
  }
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountCodeBySection/L');

  if (rsp.data) {
    accountCodes.value = rsp.data;
  }

  fetchingData.value = false;
});

onMounted(async () => {
  fetchingData.value = true;

  const rsp = await api.get('accountHead');
  if (rsp.data) {
    accountHeads.value = rsp.data.map((item: { id: number; name: string }) => ({
      id: item.id,
      name: item.name,
    }));
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
