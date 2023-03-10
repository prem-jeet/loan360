<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg">
      <div class="col">
        <q-table
          :rows="accountCodes"
          :columns="columns"
          row-key="name"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Account codes"
          no-data-label="Select a section Loan/Deposit"
          :rows-per-page-options="[0]"
        >
          <template v-slot:header-cell="props">
            <q-th :props="props" style="font-size: 1.1rem">
              {{ props.col.label }}
            </q-th>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div class="q-gutter-y-md">
              <div class="row items-center q-gutter-x-md">
                <span class="text-h4">Account codes</span>
                <q-btn
                  v-if="accountCodes.length"
                  label="Add code"
                  icon="add"
                  color="blue-7"
                  @click="addCodeDialog = true"
                />
              </div>
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
                    @click="
                      () => {
                        props.row.isEditing = true;
                        editingTempStorage.push({ ...props.row });
                      }
                    "
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    v-if="!props.row.isEditing"
                    @click="() => deleteCode(props.row)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="props.row.isEditing"
                    @click="() => saveEdited(props.row)"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="props.row.isEditing"
                    @click="() => cancelEdit(props.row)"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="code" :props="props">
                <span>{{ props.row.code }}</span>
              </q-td>
              <q-td key="name" :props="props">
                <template v-if="!props.row.isEditing">
                  {{ props.row.name }}
                </template>
                <q-input
                  v-else
                  v-model="props.row.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="props.row.name ? 'green' : 'red'"
                />
              </q-td>
              <q-td key="visible" :props="props">{{ props.row.visible }}</q-td>
              <q-td key="vtype" :props="props">{{ props.row.vtype }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <q-dialog v-model="addCodeDialog" persistent>
    <q-card style="min-width: 40vw">
      <q-form @submit.prevent="addNewCode" @reset="resetNewcodeForm">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-h4">Add code</span>
            <q-space />
            <q-btn icon="close" flat @click="addCodeDialog = false" />
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <div class="row items-center">
            <div class="col-5 text-body-1 text-weight-medium">Code:</div>
            <div class="col-5">
              <q-input
                v-model="newCode.code"
                placeholder="code"
                outlined
                dense
                :error="!newCode.code"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-5 text-body-1 text-weight-medium">Name:</div>
            <div class="col-5">
              <q-input
                v-model="newCode.name"
                placeholder="name"
                outlined
                dense
                :error="!newCode.name"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-5 text-body-1 text-weight-medium">Visible:</div>
            <div class="col-5"></div>
          </div>
          <div class="row items-center">
            <div class="col-5 text-body-1 text-weight-medium">
              Voucher type:
            </div>
            <div class="col-5"></div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Add" color="green-8" type="submit" />
          <q-btn label="Reset" color="red-8" type="reset" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, watch, reactive } from 'vue';
import { onSuccess } from 'src/utils/notification';
interface AccountCode {
  code: string;
  name: string;
  section: 'D' | 'L';
  visible: string | null;
  vtype: string | null;
  isEditing?: boolean;
}

const fetchAccountcodebySection = async (
  code: 'D' | 'L'
): Promise<Omit<AccountCode, 'isEditing'>[]> => {
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
  required?: boolean;
  label: string;
  field: string;
  align: 'left';
  sortable?: boolean;
}[] = [
  {
    name: 'actions',
    label: 'Actions',
    align: 'left',
    field: '',
  },
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
    name: 'vtype',
    required: true,
    label: 'voucher type',
    field: 'vtype',
    align: 'left',
    sortable: true,
  },
];

const saveEdited = async (data: AccountCode) => {
  const temp = { ...data };
  delete temp.isEditing;
  const rsp = await api.put('accountCode', temp);
  if (!rsp.data) {
    return;
  }

  onSuccess({
    msg: rsp.data.displayMessage,
    icon: 'sync_alt',
  });

  removeFromEditingTempStorage(data.code);
  data.isEditing = false;
};

const cancelEdit = (data: AccountCode) => {
  const orignalData = editingTempStorage.find(({ code }) => code === data.code);
  removeFromEditingTempStorage(data.code);

  data.code = orignalData!.code;
  data.name = orignalData!.name;
  data.visible = orignalData!.visible;
  data.vtype = orignalData!.vtype;
  data.isEditing = false;
};

const deleteCode = async (data: AccountCode) => {
  const rsp = await api.delete(`accountCode/${data.code}`);

  if (!rsp.data) {
    return;
  }

  onSuccess({
    msg: rsp.data.displayMessage,
    icon: 'delete',
  });

  accountCodes.value = accountCodes.value.filter(
    ({ code }) => code !== data.code
  );
};

const addNewCode = async () => {
  if (newCode.code && newCode.name) {
    const rsp = await api.post('accountCode', { ...newCode });

    if (rsp.data) {
      onSuccess({ msg: rsp.data.displayMessage, icon: 'check' });

      accountCodes.value.push({ ...newCode, isEditing: false });
      resetNewcodeForm();
    }
  }
};

const removeFromEditingTempStorage = (code: string) => {
  editingTempStorage = editingTempStorage.filter((item) => item.code !== code);
};

const resetNewcodeForm = () => {
  newCode.code = '';
  newCode.name = '';
  newCode.visible = '';
  newCode.section = 'D';
  newCode.vtype = '';
};

const sectionCode = ref(null);
const accountCodes = ref<AccountCode[]>([]);
const fetchingData = ref(false);
const codeSearchQuery = ref('');
const nameSearchQuery = ref('');
const addCodeDialog = ref(false);
let editingTempStorage: AccountCode[] = [];
const newCode = reactive<AccountCode>({
  code: '',
  name: '',
  visible: '',
  section: 'D',
  vtype: '',
});

watch(sectionCode, async () => {
  if (sectionCode.value) {
    fetchingData.value = true;
    const rsp = await fetchAccountcodebySection(sectionCode.value);

    accountCodes.value = rsp.map((data) => ({ ...data, isEditing: false }));
    newCode.section = sectionCode.value;
    fetchingData.value = false;
  }
});
</script>

<style scoped></style>
