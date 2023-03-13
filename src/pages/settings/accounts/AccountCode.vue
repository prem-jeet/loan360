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
            accountCodes.length
              ? 'No result found'
              : 'Select a section Loan/Deposit'
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
                <div class="col-auto text-h4">Account codes</div>
                <div class="col-auto">
                  <q-btn
                    size="md"
                    v-if="accountCodes.length"
                    label="Add code"
                    icon="add"
                    color="blue-7"
                    @click="addCodeDialogActive = true"
                  />
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-12 q-gutter-x-md flex items-center">
                  <span class="text-h6">Section</span>
                  <q-btn
                    v-if="accountCodes.length"
                    color="red"
                    label="clear"
                    @click="resetAccountCodeSection"
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
                <div class="col-auto q-mt-xs-md q-mt-sm-none">
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
                  autofocus
                />
              </q-td>
              <q-td key="visible" :props="props">
                <template v-if="!props.row.isEditing">
                  {{ props.row.visible }}
                </template>
                <MultiSelectInput
                  :options="visibleOptions"
                  :selected-options="
                    getSelectedOptionsFromSelectedString(
                      visibleOptions,
                      props.row.visible
                    )
                  "
                  @updated="
                    (val) =>
                      updateMultiselectSelerctedString(
                        props.row,
                        'visible',
                        val
                      )
                  "
                  v-else
                />
              </q-td>
              <q-td key="vtype" :props="props">
                <template v-if="!props.row.isEditing">
                  {{ props.row.vtype }}
                </template>
                <MultiSelectInput
                  :options="vtypeOptions"
                  :selected-options="
                    getSelectedOptionsFromSelectedString(
                      vtypeOptions,
                      props.row.vtype
                    )
                  "
                  @updated="
                    (val) =>
                      updateMultiselectSelerctedString(props.row, 'vtype', val)
                  "
                  v-else
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
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
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
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Visible :</div>
                    <div class="col-12">
                      <template v-if="!props.row.isEditing">
                        {{ props.row.visible }}
                      </template>
                      <MultiSelectInput
                        :options="visibleOptions"
                        :selected-options="
                          getSelectedOptionsFromSelectedString(
                            visibleOptions,
                            props.row.visible
                          )
                        "
                        @updated="
                          (val) =>
                            updateMultiselectSelerctedString(
                              props.row,
                              'visible',
                              val
                            )
                        "
                        v-else
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Voucher Type :</div>
                    <div class="col-12">
                      <template v-if="!props.row.isEditing">
                        {{ props.row.vtype }}
                      </template>
                      <MultiSelectInput
                        :options="vtypeOptions"
                        :selected-options="
                          getSelectedOptionsFromSelectedString(
                            vtypeOptions,
                            props.row.vtype
                          )
                        "
                        @updated="
                          (val) =>
                            updateMultiselectSelerctedString(
                              props.row,
                              'vtype',
                              val
                            )
                        "
                        v-else
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

  <q-dialog v-model="addCodeDialogActive" persistent>
    <q-card
      :style="{
        width: '100vw !important',
        maxWidth: '700px !important',
        minWidth: '350px !important',
      }"
    >
      <q-form @submit.prevent="addNewCode" @reset="resetNewcodeForm">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-h4">Add code</span>
            <q-space />
            <q-btn icon="close" flat @click="addCodeDialogActive = false" />
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <div class="row items-center">
            <div :class="addCodeLabelContainerClasses">Code:</div>
            <div :class="addCodeInputContainerClasses">
              <q-input
                v-model="newCode.code"
                placeholder="code"
                outlined
                dense
                :error="!newCode.code"
                error-message="Unique Code required"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row items-center">
            <div :class="addCodeLabelContainerClasses">Name:</div>
            <div :class="addCodeInputContainerClasses">
              <q-input
                v-model="newCode.name"
                placeholder="name"
                outlined
                dense
                :error="!newCode.name"
                error-message="Name required"
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row items-center">
            <div :class="addCodeLabelContainerClasses">Visible:</div>
            <div :class="addCodeInputContainerClasses">
              <MultiSelectInput
                :options="visibleOptions"
                :selected-options="newCode.visible"
                @updated="(val) => (newCode.visible = val)"
                ref="newVisible"
              />
            </div>
          </div>
          <div class="row items-center">
            <div :class="addCodeLabelContainerClasses">Voucher type:</div>
            <div :class="addCodeInputContainerClasses">
              <MultiSelectInput
                :options="vtypeOptions"
                :selected-options="newCode.vtype"
                @updated="(val) => (newCode.vtype = val)"
                ref="newCodeVtype"
              />
            </div>
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
import { ref, watch, reactive, computed } from 'vue';
import { onFailure, onSuccess, confirmDialog } from 'src/utils/notification';
import MultiSelectInput from 'src/components/forms/MultiSelectInput.vue';
import { useQuasar } from 'quasar';

interface AccountCode {
  code: string;
  name: string;
  section: 'D' | 'L' | null;
  visible: string | null;
  vtype: string | null;
  isEditing?: boolean;
}

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/accountcode', label: 'Account Code' },
];

const visibleOptions = [
  { value: 'CC', label: 'CC Sheet Receivable (CC)' },
  { value: 'XC', label: 'xIrr Credit (XC)' },
  { value: 'XD', label: 'xIrr Debit (XD)' },
  { value: 'CH', label: 'Charges (CH)' },
  { value: 'CB', label: 'CIBIL Balances (CB)' },
  { value: 'CT', label: 'Charges Taxable (CT)' },
  { value: 'CI', label: 'Charges Initial Overdue (CI)' },
  { value: 'CO', label: 'Collection Overdue (CO)' },
  { value: 'SC', label: 'SCF Charges (SC)' },
];
const vtypeOptions = [
  { value: 'P', label: 'Payment (P)' },
  { value: 'R', label: 'Receipt (R)' },
  { value: 'J', label: 'Journal (J)' },
  { value: 'C', label: 'Contra (C)' },
  { value: 'N', label: 'Notional (N)' },
];

const addCodeLabelContainerClasses =
  'col-5 col-sm-3 text-body-1 text-weight-medium';
const addCodeInputContainerClasses =
  'col-12 col-sm-9 col-md-7 q-mt-sm q-mt-sm-none';

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

const $q = useQuasar();
const fetchingData = ref(false);
const sectionCode = ref(null);
const accountCodes = ref<AccountCode[]>([]);
let editingTempStorage: AccountCode[] = [];
const newCodeVtype = ref(null);
const newVisible = ref(null);
const codeSearchQuery = ref('');
const nameSearchQuery = ref('');
const addCodeDialogActive = ref(false);
const newCode = reactive<{
  code: string;
  name: string;
  section: 'D' | 'L';
  visible: { label: string; value: string }[] | null;
  vtype: { label: string; value: string }[] | null;
}>({
  code: '',
  name: '',
  visible: null,
  section: 'D',
  vtype: null,
});

const filteredAccountCode = computed(() => {
  const _codeSearchQuery = codeSearchQuery.value;
  const _nameSearchQuery = nameSearchQuery.value?.toLocaleLowerCase();

  return accountCodes.value.filter((item) => {
    const codePresent = item.code.includes(_codeSearchQuery);
    const namePresent = item.name
      .toLocaleLowerCase()
      .includes(_nameSearchQuery);

    if (_codeSearchQuery && _nameSearchQuery) {
      return codePresent && namePresent;
    }

    if (_codeSearchQuery) {
      return codePresent;
    }
    if (_nameSearchQuery) {
      return namePresent;
    }

    return true;
  });
});

const fetchAccountCodeBySection = async (
  code: 'D' | 'L'
): Promise<Omit<AccountCode, 'isEditing'>[]> => {
  const rsp = await api(`accountCodeBySection/${code}`);

  if (!rsp.data) {
    return [];
  }

  return rsp.data;
};

const resetAccountCodeSection = () => {
  accountCodes.value = [];
  sectionCode.value = null;
};

const saveEdited = async (data: AccountCode) => {
  if (!data.name) {
    onFailure({ msg: 'Name cannot be empty', position: 'bottom' });
    return;
  }
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

const removeFromEditingTempStorage = (code: string) => {
  editingTempStorage = editingTempStorage.filter((item) => item.code !== code);
};

const deleteCode = (data: AccountCode) => {
  confirmDialog(() => deleteCodeConfirmed(data), {});
};

const deleteCodeConfirmed = async (data: AccountCode) => {
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
  if (!(newCode.code && newCode.name)) return;

  if (accountCodes.value.some((item) => item.code === newCode.code)) {
    onFailure({ msg: 'Code must be unique' });
    return;
  }

  const formData = preocessNewCodedata();
  const rsp = await api.post('accountCode', formData);

  onSuccess({ msg: rsp.data.displayMessage, icon: 'check' });

  accountCodes.value.push({ ...formData, isEditing: false });
};

const preocessNewCodedata = (): AccountCode => {
  const visible = !newCode.visible
    ? null
    : newCode.visible!.map((item) => item.value).join(',');
  const vtype = !newCode.vtype
    ? null
    : newCode.vtype!.map((item) => item.value).join(',');
  const temp = {
    code: newCode.code,
    name: newCode.name,
    section: sectionCode.value,
    visible,
    vtype,
  };

  return temp;
};

const formateCodeString = (string: string) =>
  string
    .toUpperCase()
    .split(' ')
    .filter((item) => item !== '')
    .join('');

const resetNewcodeForm = () => {
  newCode.code = '';
  newCode.name = '';
  newCode.visible = null;
  newCode.section = 'D';
  newCode.vtype = null;

  // @ts-expect-error method provided by q-select
  newCodeVtype.value.reset();
  // @ts-expect-error method provided by q-select
  newVisible.value.reset();
};

const getSelectedOptionsFromSelectedString = (
  arr: typeof visibleOptions,
  selectedStr: string
) => {
  if (!selectedStr) {
    return null;
  }
  return arr.filter((item) => selectedStr.includes(item.value));
};

const updateMultiselectSelerctedString = (
  row: AccountCode,
  key: 'visible' | 'vtype',
  selectedOptions: typeof visibleOptions
) => {
  if (!selectedOptions) {
    row[key] = null;
    return;
  }

  row[key] = selectedOptions.map((item) => item.value).join(',');
};

watch(newCode, () => {
  if (newCode.code) {
    newCode.code = formateCodeString(newCode.code);
  }
});

watch(sectionCode, async () => {
  if (sectionCode.value) {
    fetchingData.value = true;
    const rsp = await fetchAccountCodeBySection(sectionCode.value);

    accountCodes.value = rsp.map((data) => ({ ...data, isEditing: false }));
    newCode.section = sectionCode.value;
    fetchingData.value = false;
  }
});

watch(codeSearchQuery, () => {
  if (codeSearchQuery.value) {
    codeSearchQuery.value = formateCodeString(codeSearchQuery.value);
  }
});
</script>

<style scoped></style>
