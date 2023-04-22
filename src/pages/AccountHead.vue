<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <div class="row">
      <div class="col">
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
          :hide-bottom="!!accountHeads.length"
          selection="multiple"
          v-model:selected="selectedAccountHeads"
          row-key="id"
          @selection="({ rows }) => varifySelectedAccountHead(rows as AccountHead[])"
        >
          <template v-slot:header-selection>
            <q-btn-group>
              <q-btn size="sm" color="orange" icon="dynamic_feed" padding="sm">
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
            <div class="q-gutter-y-md q-pb-xs-md">
              <div class="row items-center q-gutter-md">
                <div class="col-auto text-h4">Account Heads</div>
                <div class="col-auto">
                  <q-btn
                    size="md"
                    label="Add Account heads"
                    icon="add"
                    color="blue-7"
                  />
                </div>
              </div>
              <div class="row q-gutter-md">
                <div class="col-12">
                  <div class="row q-gutter-md">
                    <div class="col-4">
                      <q-select
                        :options="allowedCompany"
                        label="Company"
                        v-model="searchObject.companyCode"
                        option-label="name"
                        option-value="code"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="col-4">
                      <q-select
                        :options="allowedBranch"
                        label="Branch"
                        v-model="searchObject.branchCode"
                        option-label="name"
                        option-value="code"
                        emit-value
                        map-options
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row q-gutter-md">
                    <div class="col-4">
                      <q-select
                        :options="accountGroupOptions"
                        label="A/c Group"
                        v-model="searchObject.accountGroupCode"
                        option-label="name"
                        option-value="code"
                        emit-value
                        map-options
                      />
                    </div>
                    <div class="col-4">
                      <q-select
                        :options="subLedgerCodeOptions"
                        label="Sub-Ledger Code"
                        v-model="searchObject.subLedgerCode"
                        option-label="name"
                        option-value="code"
                        emit-value
                        map-options
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row q-gutter-md items-center">
                    <div class="col-auto">Name:</div>
                    <div class="col-2">
                      <q-select
                        v-model="nameSearchcriteria"
                        :options="[
                          {
                            label: 'Starts with',
                            value: 'sw',
                          },
                          { label: 'Contains', value: 'c' },
                        ]"
                        emit-value
                        map-options
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-3">
                      <q-input
                        v-model="searchObject.accountName"
                        placeholder="Account name (min 3 char)"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-auto">
                      <q-checkbox
                        dense
                        v-model="searchObject.inActive"
                        label="In-Active"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn
                        color="grey-4"
                        text-color="black"
                        label="Search"
                        icon="search"
                        @click="search"
                      />
                    </div>
                    <div class="col-auto">
                      <q-btn
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
                <template v-for="key in ['name', 'alias', 'code']" :key="key">
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
                        {{ key }}
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
                            <q-avatar color="teal" text-color="white"
                              >BY</q-avatar
                            >
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
                    <q-btn
                      @click="props.selected = !props.selected"
                      color="primary"
                    >
                      {{ props.selected ? 'Deselect' : 'Select' }}
                      <q-checkbox
                        v-model="props.selected"
                        :color="props.selected ? 'orange' : ''"
                      />
                    </q-btn>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user/userStore';
import dayjs from 'dayjs';
import { onMounted, reactive, ref } from 'vue';
import { confirmDialog, onSuccess } from 'src/utils/notification';
import { alertDialog } from 'src/utils/notification';

interface SearchObject {
  companyCode: string | null;
  branchCode: string | null;
  accountGroupCode: string | null;
  subLedgerCode: string | null;
  accountName: string | null;
  inActive: boolean;
}

interface AccountHead {
  id: number;
  branchCode: string | null;
  accountGroupCode: string;
  accountType: string;
  companyCode: string | null;
  addressId: string | null;
  subLedgerCode: string | null;
  automatic: boolean | null;
  name: string;
  alias: string | null;
  creditDays: number | null;
  rateInt: number | null;
  sharePercent: number | null;
  lockedOn: string | null;
  panNo: string | null;
  costCenter: string | null;
  refrenceAdjust: string | null;
  createdOn: string | null;
  updatedOn: string | null;
  inactive: boolean;
  inactiveOn: string | null;
  code: string | null;
  chequeFormatFile: string | null;
  accountNo: string | null;
  createdOnBy: string | null;
  updatedOnBy: string;
  inactiveOnBy: string | null;
  nachUniqueId: string | null;
  nachBankCode: string | null;
  reverseAccountGroupCode: string | null;
  ecsUserCode: string | null;
  micrCode: string | null;
  bankFormatCode: string | null;
  showInAllBranches: boolean;
  taxClassId: number | null;
  stateId: number;
  taxNo: string | null;
  hsnCode: string | null;
  attachments: string | null;
  kyc: string | null;
  taxCategory: string | null;
  lockedUpdatedOn: string | null;
  tdsClassId: number | null;
  tdsType: string | null;
  tdsEditable: boolean;
  tds: boolean;
  ndsi500ItemCode: string | null;
  nbs7ItemCode: string | null;
  tax: boolean;
  roleCode: string;
  drFromAmount: number | null;
  drToAmount: number | null;
  crFromAmount: number | null;
  crToAmount: number | null;
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

const getDate = (date: Date) => {
  return dayjs(date).format('DD/MM/YY @h:mma');
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

const search = async () => {
  isPerformingAction.value = true;
  const query = buildQuery();

  const rsp = await api.post('accountHead/search', {
    pageNo: 1,
    pageSize: 10,
    where: query,
  });

  if (rsp.data) {
    // console.log(rsp.data);

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
        () => removeSelectedAccountHead(currentSelectedAccount[0].id),
        0
      );
    }
    if (currentSelectedAccount[0].subLedgerCode && !subLedgerCode) {
      alertDialog(
        "Currently selected account has subledger but Already selected accounts doesn't have subledger",
        'Error'
      );
      setTimeout(
        () => removeSelectedAccountHead(currentSelectedAccount[0].id),
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
