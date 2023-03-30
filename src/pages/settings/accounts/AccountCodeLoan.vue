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
                    v-if="accountCodeLoan.length"
                    label="Add Account code loan"
                    icon="add"
                    color="blue-7"
                    @click="isAddNewEntryModalActive = true"
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
                  <div class="q-gutter-lg">
                    <q-radio v-model="sectionCode" val="L" label="Loan" />
                    <q-radio
                      v-model="sectionCode"
                      val="LAP"
                      label="Loan Against Property"
                    />
                    <q-radio
                      v-model="sectionCode"
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
                    v-if="!props.row.isEditing"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    v-if="!props.row.isEditing"
                    @click="() => deleteEntry(props.rowIndex)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="props.row.isEditing"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="props.row.isEditing"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="accountCode" :props="props">
                <span>{{
                  accountCodes.find(
                    (item) => item.code === props.row.accountCode
                  )!.name
                }}</span>
              </q-td>
              <q-td key="id" :props="props">
                <template v-if="!props.row.isEditing">
                  {{
                    accountHeads.find(
                      (item) => item.id === props.row.accountId
                    )!.name
                  }}
                </template>
                <q-input
                  v-else
                  v-model="props.row.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="props.row.name ? 'green' : 'red'"
                  autofocus
                />
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->

          <template v-slot:item="props">
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
                      v-if="!props.row.isEditing"
                    >
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="delete"
                      size="xs"
                      outline
                      color="red"
                      v-if="!props.row.isEditing"
                      @click="() => deleteEntry(props.rowIndex)"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="check"
                      size="xs"
                      outline
                      color="green-10"
                      v-if="props.row.isEditing"
                    >
                      <q-tooltip>Save</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="close"
                      size="xs"
                      outline
                      color="red"
                      v-if="props.row.isEditing"
                    >
                      <q-tooltip>Cancel</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Code :</div>
                    <div class="col-12">
                      <template v-if="!props.row.isEditing">
                        {{
                          accountCodes.find(
                            (item) => item.code === props.row.accountCode
                          )!.name
                        }}
                      </template>
                      <q-input
                        v-else
                        v-model="props.row.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="props.row.name ? 'green' : 'red'"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">account Name :</div>
                    <div class="col-12">
                      <template v-if="!props.row.isEditing">
                        {{
                          accountHeads.find(
                            (item) => item.id === props.row.accountId
                          )!.name
                        }}
                      </template>
                      <q-input
                        v-else
                        v-model="props.row.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="props.row.name ? 'green' : 'red'"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <q-dialog v-model="isAddNewEntryModalActive" @show="loadAccountCodes">
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
        <q-card-section class="q-px-lg q-py-md">
          <div class="row">
            <div class="col-12">
              <!-- <q-input
                v-model="newEntryData.code"
                label="Code"
                maxlength="10"
                counter
                autofocus
                :error="!newEntryData.code"
              >
                <template v-slot:hint>characters</template>
              </q-input>
              <div class="col-12 q-mt-lg">
                <q-input
                  v-model="newEntryData.name"
                  label="Name"
                  :error="!newEntryData.name"
                />
              </div> -->
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newEntryData"
                  :options="accountCodeOptions"
                  label="Account Code"
                  outlined
                  behavior="menu"
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newEntryData"
                  use-input
                  hide-dropdown-icon
                  :options="accountHeadOptions"
                  label="Account name"
                  outlined
                  @input-value="loadAccountHeads"
                  ref="dropdown"
                />
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
import { confirmDialog, onSuccess } from 'src/utils/notification';

import { ref, computed, watch, onMounted } from 'vue';

const newEntryData = ref('');

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
  id: number;
  accountCode: string;
  accountId: number;
  accountingCategoryCode: string;
}
const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/natureEntry', label: 'Account Code Loan' },
];
const sectionCode = ref(null);
const fetchingData = ref(false);
const accountCodes = ref<AccountCodes[]>([]);
const accountHeads = ref<AccountHeads[]>([]);
const accountCodeLoan = ref<AccountCodeLoan[]>([]);
const accountCodeOptions = ref<AccountCodeOptions[]>([]);
const accountHeadOptions = ref<AccountHeadOptions[]>([]);
const dropdown = ref(null);

const isAddNewEntryModalActive = ref(false);
const filteredAccountCode = computed(() => {
  return accountCodeLoan.value;
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
  console.log('hello', newEntryData.value);
};

const resetNewEntryForm = () => {
  console.log('hi');
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

    accountCodeLoan.value = [
      ...accountCodeLoan.value.splice(0, rowIndex),
      ...accountCodeLoan.value.splice(rowIndex + 1),
    ];
  }
};

const resetAccountCodeLoanSection = () => {
  accountCodeLoan.value = [];
  sectionCode.value = null;
};

const fetchAccountCodeLoanByAccountingCategory = async (
  code: 'D' | 'L'
): Promise<Omit<AccountCodeLoan, 'isEditing'>[]> => {
  const rsp = await api(`accountCodeLoanByAccountingCategory/${code}`);

  if (!rsp.data) {
    return [];
  }
  return rsp.data;
};

watch(sectionCode, async () => {
  if (sectionCode.value) {
    fetchingData.value = true;
    const rsp = await fetchAccountCodeLoanByAccountingCategory(
      sectionCode.value
    );

    accountCodeLoan.value = rsp.map((data) => ({ ...data, isEditing: false }));
    fetchingData.value = false;
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
