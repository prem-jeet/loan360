<template>
  <div class="absolute q-px-md q-pt-sm full-width full-height bg-gre-4">
    <div class="row">
      <div class="col q-mb-lg q-pb-lg">
        <q-table
          :rows="accountHeads"
          :columns="tableColumns"
          :loading="isPerformingAction"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          :rows-per-page-options="[0]"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
          selection="multiple"
          v-model:selected="selectedAccountHeads"
          row-key="id"
          @selection="({ rows }) => varifySelectedAccountHead(rows as AccountHead[])"
          :hide-bottom="$q.screen.width < 830"
        >
          <template v-slot:bottom>
            <div class="row col-grow q-py-sm">
              <div class="flex items-center" :style="{ gap: '1rem' }">
                <q-btn
                  icon="first_page"
                  v-if="pagination.pageNo > 1"
                  class="q-pa-sm"
                  color="grey-4"
                  text-color="blue-grey-10"
                  round
                  @click="pagination.pageNo = 1"
                />
                <q-btn
                  icon="keyboard_double_arrow_left"
                  v-if="pagination.pageNo > 1"
                  class="q-pa-sm"
                  color="grey-4"
                  text-color="blue-grey-10"
                  round
                  @click="pagination.pageNo -= 1"
                />
                <q-btn
                  icon="keyboard_double_arrow_right"
                  v-if="pagination.rowsPerPage === accountHeads.length"
                  class="q-pa-sm"
                  round
                  color="grey-4"
                  text-color="blue-grey-10"
                  @click="pagination.pageNo += 1"
                />
                <span><b>On page</b> : {{ pagination.pageNo }}</span>
              </div>
            </div>
          </template>

          <template v-slot:header-selection>
            <q-btn-group>
              <q-btn
                size="sm"
                color="orange"
                icon="dynamic_feed"
                padding="sm"
                @click="removeDuplicate"
              >
                <q-tooltip> Remove duplicate</q-tooltip>
              </q-btn>
              <q-btn
                dense
                icon="close"
                size="sm"
                color="red"
                padding="sm"
                @click="selectedAccountHeads = []"
                v-if="selectedAccountHeads.length"
              >
                <q-tooltip>Remove selection</q-tooltip>
              </q-btn>
            </q-btn-group>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div
              class="col-grow"
              :class="{ 'q-pb-xs-md': searchExpansionItemExpanded }"
            >
              <div class="row items-center">
                <div class="col-12 col-sm-auto text-h4">Account Heads</div>
                <div class="col-12 col-sm-auto q-mt-md q-mt-sm-none q-ml-sm-md">
                  <q-btn
                    size="md"
                    label="Add Account head"
                    icon="add"
                    color="blue-7"
                    @click="
                      (editingAccountHeadIndex = null),
                        (isAddAccountHeadFormActive = true)
                    "
                  />
                  <q-btn
                    class="q-ml-md q-px-sm"
                    icon="filter_alt"
                    color="blue-grey"
                    @click="
                      searchExpansionItemExpanded = !searchExpansionItemExpanded
                    "
                  />
                </div>
              </div>
              <div class="q-mt-md">
                <q-expansion-item
                  hide-expand-icon
                  v-model="searchExpansionItemExpanded"
                  header-class="q-pa-none"
                  header-style="display:none"
                  default-opened
                >
                  <div class="row">
                    <div class="col-12">
                      <div class="row q-col-gutter-sm-x-md">
                        <div class="col-12 col-sm-6 col-md-4">
                          <q-select
                            :options="allowedCompany"
                            label="Company"
                            v-model="searchObject.companyCode"
                            option-label="name"
                            option-value="code"
                            emit-value
                            map-options
                            behaviour="menu"
                            clearable
                            clear-icon="backspace"
                            dropdown-icon="expand_more"
                          />
                        </div>
                        <div
                          class="col-12 col-sm-6 col-md-4 q-mt-md q-mt-sm-none"
                        >
                          <q-select
                            :options="allowedBranch"
                            label="Branch"
                            v-model="searchObject.branchCode"
                            option-label="name"
                            option-value="code"
                            emit-value
                            map-options
                            behaviour="menu"
                            clearable
                            clear-icon="backspace"
                            dropdown-icon="expand_more"
                            options-dense
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-12 q-mt-md">
                      <div class="row q-col-gutter-sm-x-md">
                        <div class="col-12 col-sm-6 col-md-4">
                          <q-select
                            :options="accountGroupOptions"
                            label="A/c Group"
                            v-model="searchObject.accountGroupCode"
                            option-label="name"
                            option-value="code"
                            emit-value
                            map-options
                            behaviour="menu"
                            clearable
                            clear-icon="backspace"
                            dropdown-icon="expand_more"
                          />
                        </div>
                        <div
                          class="col-12 col-sm-6 col-md-4 q-mt-md q-mt-sm-none"
                        >
                          <q-select
                            :options="subLedgerCodeOptions"
                            label="Sub-Ledger Code"
                            v-model="searchObject.subLedgerCode"
                            option-label="name"
                            option-value="code"
                            emit-value
                            map-options
                            behaviour="menu"
                            clearable
                            clear-icon="backspace"
                            dropdown-icon="expand_more"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-12 q-mt-md">
                      <div class="row items-center">
                        <div
                          class="col-12 col-sm-4 col-md-2 q-mb-md q-mb-sm-none"
                        >
                          <q-select
                            v-model="nameSearchcriteria"
                            :options="[
                              {
                                label: 'Name starts with',
                                value: 'sw',
                              },
                              { label: 'Name Contains', value: 'c' },
                            ]"
                            emit-value
                            map-options
                            outlined
                            dense
                            behavior="menu"
                          />
                        </div>
                        <div class="col-7 col-sm-5 col-md-3 q-ml-sm-md">
                          <q-input
                            v-model="searchObject.accountName"
                            placeholder="Account name (min 3 char)"
                            outlined
                            dense
                          />
                        </div>
                        <div class="col-4 col-sm-2 q-ml-md">
                          <q-checkbox
                            dense
                            v-model="searchObject.inActive"
                            label="In-Active"
                          />
                        </div>
                        <div class="col-12 q-mt-md">
                          <div class="flex justify-center justify-md-start">
                            <q-btn
                              color="grey-4"
                              text-color="black"
                              label="Search"
                              icon="search"
                              @click="search"
                            />
                            <q-btn
                              class="q-ml-md"
                              color="red-5"
                              text-color="black"
                              label="reset"
                              icon="restart_alt"
                              @click="resetSearchParameters"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 q-mt-md" v-if="$q.screen.width < 830">
                      <div class="flex flex-center">
                        <q-btn
                          label="remove duplicate"
                          @click="removeDuplicate"
                          color="orange"
                          icon="dynamic_feed"
                          padding="sm"
                          text-color="black"
                        />
                      </div>
                    </div>
                  </div>
                </q-expansion-item>
              </div>

              <div
                class="flex items-center q-py-md"
                :style="{ gap: '1rem' }"
                v-if="$q.screen.width < 830"
              >
                <q-btn
                  icon="first_page"
                  v-if="pagination.pageNo > 1"
                  class="q-pa-sm"
                  color="grey-4"
                  text-color="blue-grey-10"
                  round
                  size="sm"
                  @click="pagination.pageNo = 1"
                />
                <q-btn
                  icon="keyboard_double_arrow_left"
                  v-if="pagination.pageNo > 1"
                  class="q-pa-sm"
                  color="grey-4"
                  text-color="blue-grey-10"
                  round
                  size="sm"
                  @click="pagination.pageNo -= 1"
                />
                <q-btn
                  icon="keyboard_double_arrow_right"
                  v-if="pagination.rowsPerPage === accountHeads.length"
                  class="q-pa-sm"
                  round
                  color="grey-4"
                  text-color="blue-grey-10"
                  size="sm"
                  @click="pagination.pageNo += 1"
                />
                <span><b>On page</b> : {{ pagination.pageNo }}</span>
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
              <q-td :key="`${props.selected}`">
                <div class="flex flex-center">
                  <q-checkbox
                    v-model="props.selected"
                    :color="props.selected ? 'orange' : ''"
                  />
                </div>
              </q-td>
              <q-td
                v-for="key in ['name', 'alias', 'code']"
                :key="key"
                :props="props"
              >
                {{ props.row[key] }}
              </q-td>
              <q-td key="inactive">
                <div class="flex flex-center">
                  <q-icon
                    :name="props.row.inactive ? 'check' : 'close'"
                    size="sm"
                    class="text-weight-bold"
                    :class="[
                      props.row.inactive ? 'text-red-5' : 'text-green-5',
                    ]"
                  />
                </div>
              </q-td>
              <q-td
                :key="key"
                v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
              >
                {{ props.row[key] && getDate(props.row[key]) }}
                <div>
                  <q-chip
                    v-if="props.row[key] && props.row[`${key}By`]"
                    color="yellow"
                    size="sm"
                  >
                    <q-avatar color="teal" text-color="white">BY</q-avatar>
                    <span class="text-weight-medium">
                      {{ props.row[`${key}By`] }}
                    </span>
                  </q-chip>
                </div>
              </q-td>
              <q-td key="actions" auto-width>
                <q-btn-group push unelevated>
                  <q-btn
                    padding="sm"
                    push
                    unelevated
                    icon="edit"
                    size="sm"
                    color="teal-2"
                    text-color="black"
                    @click="
                      (editingAccountHeadIndex = props.rowIndex),
                        (isAddAccountHeadFormActive = true)
                    "
                  />
                  <q-btn
                    padding="sm"
                    push
                    unelevated
                    icon="attach_file"
                    size="sm"
                    color="blue-2"
                    text-color="black"
                  >
                    <q-tooltip>Attach</q-tooltip>
                  </q-btn>
                  <q-btn
                    push
                    unelevated
                    size="sm"
                    color="red-2"
                    text-color="black"
                    :label="props.row.inactive ? 'activate' : 'de-activate'"
                    @click="
                      confirmDialog(
                        () =>
                          toggleActivation(
                            props.row.id,
                            props.row.inactive,
                            props.rowIndex
                          ),
                        {
                          msg: `Are you sure you want to ${
                            props.row.inactive ? 'Activate' : 'De-Activate'
                          }?`,
                        }
                      )
                    "
                  />
                </q-btn-group>
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row">
                    <div class="col-12 text-weight-medium text-uppercase">
                      name
                    </div>
                    <div class="col-12">
                      <q-chip
                        color="light-blue-2"
                        clickable
                        @click="props.selected = !props.selected"
                      >
                        <q-avatar
                          :icon="props.selected ? 'check' : 'add'"
                          color="teal"
                          text-color="white"
                          size="md"
                        />
                        <span class="text-weight-medium">
                          {{ props.row.name }}
                        </span>
                      </q-chip>
                    </div>
                  </div>
                </q-card-section>
                <template v-for="key in ['alias', 'code']" :key="key">
                  <q-card-section v-if="props.row[key]">
                    <div class="row">
                      <div class="col-12 text-weight-medium text-uppercase">
                        {{ key }}
                      </div>
                      <div class="col-12">{{ props.row[key] }}</div>
                    </div>
                  </q-card-section>
                </template>
                <template
                  :key="key"
                  v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                >
                  <q-card-section v-if="props.row[key]">
                    <div class="row">
                      <div class="col-12 text-weight-medium text-uppercase">
                        {{ `${key.split('On').join('-')}ON` }}
                      </div>
                      <div class="col-12">
                        <div>
                          {{ getDate(props.row[key]) }}
                        </div>
                        <div>
                          <q-chip
                            v-if="props.row[key] && props.row[`${key}By`]"
                            color="yellow"
                            size="sm"
                          >
                            <q-avatar color="teal" text-color="white">
                              BY
                            </q-avatar>
                            <span class="text-weight-medium">
                              {{ props.row[`${key}By`] }}
                            </span>
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </template>
                <q-separator />
                <q-card-actions class="q-py-md bg-grey-2">
                  <div
                    class="row justify-evenly"
                    :style="{ rowGap: '20px', columnGap: '10px' }"
                  >
                    <q-btn
                      label="edit"
                      icon="edit"
                      color="teal-2"
                      text-color="black"
                      @click="
                        (editingAccountHeadIndex = props.rowIndex),
                          (isAddAccountHeadFormActive = true)
                      "
                    />
                    <q-btn
                      label="attachment"
                      icon="attach_file"
                      color="blue-2"
                      text-color="black"
                    />
                    <q-btn
                      :label="props.row.inactive ? 'activate' : 'de-activate'"
                      @click="
                        confirmDialog(
                          () =>
                            toggleActivation(
                              props.row.id,
                              props.row.inactive,
                              props.rowIndex
                            ),
                          {
                            msg: `Are you sure you want to ${
                              props.row.inactive ? 'Activate' : 'De-Activate'
                            }?`,
                          }
                        )
                      "
                      color="red-2"
                      text-color="black"
                    />
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <MergeDuplicateAccoutheadsForm
      v-if="isMergeFormActive"
      @close="isMergeFormActive = false"
      :duplicateList="duplicateAccountHeads"
      @merge="mergeAccountHeads"
    />
    <AddAccountHeadForm
      v-if="isAddAccountHeadFormActive"
      :account-head="
        editingAccountHeadIndex === null
          ? null
          : accountHeads[editingAccountHeadIndex]
      "
      @close="isAddAccountHeadFormActive = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { AccountHead } from 'src/types/AccountHead';
import { date } from 'quasar';
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user/userStore';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { confirmDialog, onSuccess } from 'src/utils/notification';
import { alertDialog } from 'src/utils/notification';
import MergeDuplicateAccoutheadsForm from 'src/components/maintenance/accountMaster/accountHead/MergeDuplicateAccountheadsForm.vue';
import AddAccountHeadForm from 'src/components/maintenance/accountMaster/accountHead/AddAccountHeadForm.vue';

interface SearchObject {
  companyCode: string | null;
  branchCode: string | null;
  accountGroupCode: string | null;
  subLedgerCode: string | null;
  accountName: string | null;
  inActive: boolean;
}

const tableColumns: {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align: 'left';
  sortable?: boolean;
}[] = [
  { name: 'name', field: 'name', align: 'left', label: 'Name' },
  { name: 'alias', field: 'alias', align: 'left', label: 'Alias' },
  { name: 'code', field: 'code', align: 'left', label: 'Code' },
  { name: 'inactive', field: 'inactive', align: 'left', label: 'In-active' },
  { name: 'createdOn', field: 'createdOn', align: 'left', label: 'Created' },
  { name: 'updatedOn', field: 'updated', align: 'left', label: 'Updated' },
  {
    name: 'inactiveOn',
    field: 'inactiveOn',
    align: 'left',
    label: 'Inactive Date',
  },
  { name: 'actions', field: '', align: 'left', label: 'Actions' },
];

const pagination = reactive({
  pageNo: 1,
  rowsPerPage: 10,
});
const searchExpansionItemExpanded = ref(true);
const isAddAccountHeadFormActive = ref(false);
const editingAccountHeadIndex = ref<number | null>(null);
const isPerformingAction = ref(false);
const { allowedCompany, allowedBranch } = storeToRefs(useUserStore());
const accountGroupOptions = ref<{ code: string; name: string }[]>([]);
const subLedgerCodeOptions = ref<{ code: string; name: string }[]>([]);
const nameSearchcriteria = ref<'sw' | 'c'>('sw');
const accountHeads = ref<AccountHead[]>([]);
const selectedAccountHeads = ref<AccountHead[]>([]);
const searchObject = reactive<SearchObject>({
  companyCode: null,
  branchCode: null,
  accountGroupCode: null,
  subLedgerCode: null,
  accountName: null,
  inActive: false,
});
const isMergeFormActive = ref(false);
const duplicateAccountHeads = computed(() => {
  if (!selectedAccountHeads.value.length) {
    return [];
  }
  return selectedAccountHeads.value.map((accountHead) => ({
    id: accountHead.id!,
    name: accountHead.name!,
  }));
});

const getDate = (_date: Date) => {
  return date.formatDate(_date, 'DD/MM/YY @h:mma');
};

const buildQuery = () => {
  const parameters = [
    'companyCode',
    'branchCode',
    'accountGroupCode',
    'subLedgerCode',
  ].reduce((acc, key) => {
    const parameter = searchObject[key as keyof SearchObject];
    if (parameter) {
      return acc + ` and ${key}='${parameter}'`;
    }
    return acc;
  }, '');
  const nameParameter = searchObject.accountName
    ? ` and lower(name) like lower('${
        nameSearchcriteria.value === 'c' ? '%' : ''
      }${searchObject.accountName}%')`
    : '';

  const inActiveParameter = searchObject.inActive
    ? ' and c.inactive= true'
    : ' and (c.inactive is null or c.inactive is false)';
  return `1=1 ${parameters}${nameParameter}${inActiveParameter} ORDER BY c.name ASC`;
};

const resetSearchParameters = () => {
  searchObject.companyCode = null;
  searchObject.branchCode = null;
  searchObject.accountGroupCode = null;
  searchObject.subLedgerCode = null;
  searchObject.accountName = null;
  searchObject.inActive = false;
  nameSearchcriteria.value = 'sw';
};

watch(
  () => pagination.pageNo,
  () => search()
);

const search = async () => {
  isPerformingAction.value = true;
  const query = buildQuery();

  const rsp = await api.post('accountHead/search', {
    pageNo: pagination.pageNo,
    pageSize: pagination.rowsPerPage,
    where: query,
  });

  if (rsp.data) {
    accountHeads.value = [...rsp.data];
  }
  isPerformingAction.value = false;
};

const toggleActivation = async (
  id: number,
  isInactive: boolean,
  index: number
) => {
  const url = `accountHead/${isInactive ? 'active' : 'inactive'}`;
  const rsp = await api.put(url, { id });
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  accountHeads.value[index].inactive = !accountHeads.value[index].inactive;
};

const varifySelectedAccountHead = (currentSelectedAccount: AccountHead[]) => {
  if (selectedAccountHeads.value.length) {
    const { subLedgerCode } = selectedAccountHeads.value[0];

    if (!currentSelectedAccount[0].subLedgerCode && subLedgerCode) {
      alertDialog(
        "Currently selected account doesn't has subledger but Already selected accounts has subledger",
        'Error'
      );
      setTimeout(
        () => removeSelectedAccountHead(currentSelectedAccount[0].id!),
        0
      );
    }
    if (currentSelectedAccount[0].subLedgerCode && !subLedgerCode) {
      alertDialog(
        "Currently selected account has subledger but Already selected accounts doesn't have subledger",
        'Error'
      );
      setTimeout(
        () => removeSelectedAccountHead(currentSelectedAccount[0].id!),
        0
      );
    }
  }
};

const removeSelectedAccountHead = (id: number) =>
  (selectedAccountHeads.value = selectedAccountHeads.value.filter(
    (accountHead) => {
      return accountHead.id !== id;
    }
  ));

const removeDuplicate = () => {
  if (!selectedAccountHeads.value.length) {
    alertDialog('Please select Account Heads.', 'Error');
    return;
  }
  if (selectedAccountHeads.value.length === 1) {
    alertDialog('Please select atleast 2 Accountn Heads', 'Error');
    return;
  }
  isMergeFormActive.value = true;
};

const mergeAccountHeads = async (payload: { id: number; ids: number[] }) => {
  const rsp = await api.post('accountHead/dedupe', payload);

  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }

  accountHeads.value = accountHeads.value.filter(
    ({ id }) => !payload.ids.includes(id!)
  );
};

watch(accountHeads, () => (selectedAccountHeads.value = []));

onMounted(async () => {
  isPerformingAction.value = true;
  const accountGroup = await api.get('accountGroup');
  if (accountGroup.data) {
    accountGroupOptions.value = [...accountGroup.data];
  }
  const subLedger = await api.get('subLedger');
  if (subLedger.data) {
    subLedgerCodeOptions.value = [...subLedger.data];
  }
  isPerformingAction.value = false;
});
</script>

<style scoped></style>
