<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :grid="$q.screen.width < 830"
          :hide-bottom="$q.screen.width < 830"
          :rows="ledgerLoanConfigurations"
          :columns="columns"
          table-header-class="bg-deep-purple-10 text-white"
          :rows-per-page-options="[0]"
          :loading="isPerformingAction"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div class="row items-center q-gutter-md">
              <div class="col-12 text-h4">Ledger Loan Configuration</div>
              <div class="col-auto">
                <q-btn
                  size="md"
                  v-if="ledgerLoanConfigurations.length"
                  label="Add Ledger Loan Configuration"
                  icon="add"
                  color="blue-7"
                  @click="
                    editingRowIndex = null;
                    setInitialFormdata();
                    isDialogActive = true;
                  "
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
              <q-td key="itemOrder" :props="props">
                {{ props.row.itemOrder }}
                <q-btn-group push unelevated flat class="q-ml-md">
                  <q-btn
                    padding="sm"
                    icon="edit"
                    size="xs"
                    flat
                    color="accent"
                    @click="
                      editingRowIndex = props.rowIndex;
                      setInitialFormdata();
                      isDialogActive = true;
                    "
                  />
                  <q-btn
                    padding="sm"
                    icon="delete"
                    size="xs"
                    flat
                    color="red"
                    @click="() => deleteConfig(props.row.id)"
                  />
                </q-btn-group>
              </q-td>
              <q-td key="ledgerType" :props="props">
                <span>
                  {{
                    ledgerTypes[
                      props.row.ledgerType as keyof typeof ledgerTypes
                    ]
                  }}
                </span>
              </q-td>
              <td
                v-for="key in new Array(3)
                  .fill(0)
                  .map((item, index) => `accountCode${index + 1}`)"
                :key="key"
                :props="props"
              >
                <span>{{ props.row[key] }}</span>
              </td>

              <q-td key="interestMethod" :props="props">
                <span>
                  {{
                    interestMethods[
                      props.row.interestMethod as keyof typeof interestMethods
                    ]
                  }}
                </span>
              </q-td>
              <q-td key="rateType" :props="props">
                <span>
                  {{ rateTypes[props.row.rateType as keyof typeof rateTypes] }}
                </span>
              </q-td>

              <q-td
                v-for="key in ['rate', 'negativeRate', 'graceDays', 'viewType']"
                :key="key"
                :props="props"
              >
                <span>{{ props.row[key] }}</span>
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <template v-for="field in fields">
                  <q-card-section
                    :key="field"
                    class="q-pb-none"
                    v-if="props.row[field] !== null && props.row[field] !== ''"
                  >
                    <div class="row q-gutter-sm">
                      <div class="col-12 text-weight-medium">
                        {{
                          columns.find((column) => column.field === field)!
                            .label
                        }}
                      </div>
                      <div class="col-12">
                        {{
                          field === 'ledgerType'
                            ? ledgerTypes[
                                props.row.ledgerType as keyof typeof ledgerTypes
                              ]
                            : field === 'interestMethod'
                            ? interestMethods[
                                props.row
                                  .interestMethod as keyof typeof interestMethods
                              ]
                            : props.row[field]
                        }}
                      </div>
                    </div>
                  </q-card-section>
                </template>
                <q-card-actions
                  align="center"
                  class="q-py-md bg-grey-2 q-mt-md"
                >
                  <q-btn
                    label="edit"
                    icon="edit"
                    color="teal"
                    size="sm"
                    @click="
                      editingRowIndex = props.rowIndex;
                      setInitialFormdata();
                      isDialogActive = true;
                    "
                  />
                  <q-btn
                    label="Delete"
                    color="red"
                    icon="delete"
                    size="sm"
                    @click="() => deleteConfig(props.row.id)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <q-dialog
    v-model="isDialogActive"
    persistent
    :maximized="$q.screen.width < 830"
    full-height
  >
    <q-card
      :style="{ minWidth: $q.screen.width < 1200 ? '60vw' : '40vw' }"
      class="column"
    >
      <q-card-section class="row items-center bg-grey-2 col-auto">
        <div class="text-h6">Ledger loan configuration</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-form
        @submit.prevent="submitHandler"
        @reset="setInitialFormdata"
        class="column col"
      >
        <!-- :style="{ maxHeight: $q.screen.width < 830 ? '75vh' : '75vh' }" -->
        <q-card-section
          :style="{ maxHeight: $q.screen.width < 830 ? '82vh' : '75vh' }"
          class="scroll q-px-lg"
        >
          <div class="row justify-evenly q-gutter-md">
            <!-- item order -->
            <div class="col-12 col-md">
              <q-input
                type="number"
                v-model.number="tempConfig.itemOrder"
                label="Item order"
                :min="1"
                :rules="[(val:string) => val!==null && val!=='']"
              />
            </div>
            <!-- ledger type -->
            <div class="col-12 col-md">
              <q-select
                v-model="tempConfig.ledgerType"
                label="Ledger Type"
                :options="getMultiselectOptions(ledgerTypes)"
                emit-value
                map-options
                menu-shrink
                :rules="[(val) => val !== null]"
                behavior="menu"
              />
            </div>
          </div>

          <div class="row justify-evenly q-gutter-md">
            <!-- account code 1 -->
            <div class="col">
              <q-select
                v-model="tempConfig.accountCode1"
                label="Accout Code 1"
                :options="accountCodeTypes"
                options-dense
                map-options
                menu-shrink
                emit-value
                clearable
                :rules="[(val:string) => {
                  if (tempConfig.ledgerType === 'I' ? tempConfig.accountCode2 : tempConfig.ledgerType === 'L' ? tempConfig.accountCode2 || tempConfig.accountCode3 : false) {
            return !!val;
              } 

                return true;
                }]"
                behavior="menu"
              />
            </div>
            <!-- account code 2 -->
            <div class="col">
              <q-select
                v-model="tempConfig.accountCode2"
                label="Accout Code 2"
                :options="accountCodeTypes"
                options-dense
                map-options
                menu-shrink
                emit-value
                clearable
                :rules="[(val:string) => {
                  if (tempConfig.ledgerType === 'L' && tempConfig.accountCode3) {
                  return !!val;
                  } 
                return true;
                }]"
                behavior="menu"
              />
            </div>
            <!-- account code 3 -->
            <div class="col-12 col-md" v-if="tempConfig.ledgerType === 'L'">
              <q-select
                v-model="tempConfig.accountCode3"
                label="Accout Code 3"
                :options="accountCodeTypes"
                options-dense
                map-options
                menu-shrink
                emit-value
                clearable
                behavior="menu"
              />
            </div>
          </div>

          <template v-if="tempConfig.ledgerType === 'I'">
            <div class="row q-gutter-x-md">
              <!-- interest methods -->
              <div class="col-12 col-md">
                <q-select
                  v-model="tempConfig.interestMethod"
                  label="Interest Methods"
                  :options="getMultiselectOptions(interestMethods)"
                  map-options
                  menu-shrink
                  emit-value
                  options-dense
                  :rules="[(val:string) => val !== null]"
                  behavior="menu"
                />
              </div>
              <!-- rate type -->
              <div class="col">
                <q-select
                  v-model="tempConfig.rateType"
                  label="Rate type"
                  :options="getMultiselectOptions(rateTypes)"
                  map-options
                  menu-shrink
                  emit-value
                  clearable
                  behavior="menu"
                />
              </div>
              <!-- rate -> single-->
              <div
                class="col flex flex-center"
                v-if="tempConfig.rateType === 'S'"
              >
                <q-input
                  v-model.number="tempConfig.rate"
                  label="Rate"
                  outlined
                  dense
                  hide-bottom-space
                />
              </div>
            </div>

            <div
              class="row justify-evenly q-gutter-md q-mt-xs q-mt-md-none"
              v-if="tempConfig.rateType === 'B'"
            >
              <div class="col flex items-center">
                <!-- rate -> bucket -->
                <div class="row justify-evenly items-center q-gutter-x-xs">
                  <q-input
                    class="col"
                    dense
                    outlined
                    label="Days"
                    v-model.number="bucketBasedRateInput.days1"
                    type="number"
                    hide-bottom-space
                  />
                  <q-input
                    class="col"
                    dense
                    outlined
                    label="Days"
                    v-model.number="bucketBasedRateInput.days2"
                    type="number"
                    hide-bottom-space
                  />
                  <q-input
                    class="col"
                    dense
                    outlined
                    label="Rate"
                    v-model.number="bucketBasedRateInput.rate"
                    type="number"
                    hide-bottom-space
                  />
                  <div class="col-2">
                    <q-btn
                      icon="add"
                      round
                      color="teal"
                      dense
                      outline
                      @click.stop="addRateToBucket"
                      type="button"
                    />
                  </div>
                </div>
              </div>
              <!-- rate -> bucket display-->
              <div class="col" v-if="bucketBasedRateArr.length">
                <div class="row">
                  <div
                    class="col-auto"
                    v-for="(rate, index) in bucketBasedRateArr"
                    :key="`${rate.days1}-${rate.days2}-${rate.rate}`"
                  >
                    <q-chip
                      removable
                      @remove="() => removeRateFromBucket(index)"
                    >
                      {{ `${rate.days1}-${rate.days2}-${rate.rate}` }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-evenly q-gutter-md q-mt-xs">
              <!-- negative rate -->
              <div class="col">
                <q-input
                  v-model.number="tempConfig.negativeRate"
                  :min="0"
                  label="Negative rate"
                  type="number"
                />
              </div>
              <!-- grace days -->
              <div class="col">
                <q-input
                  v-model.number="tempConfig.graceDays"
                  :min="0"
                  label="Grace days"
                  type="number"
                />
              </div>
            </div>
          </template>

          <div class="col-12 q-mt-md">
            <q-input
              v-model="tempConfig.viewType"
              label="View type"
              :rules="[(val) => val !== null && val !== '']"
              clearable
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-py-md bg-grey-2 q-mt-auto">
          <q-btn
            :label="editingRowIndex === null ? 'Add' : 'Save '"
            :icon="editingRowIndex === null ? 'add' : 'save '"
            color="teal"
            type="submit"
          />
          <q-btn label="Reset" type="reset" color="red" icon="refresh" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { confirmDialog, onFailure, onSuccess } from 'src/utils/notification';
import { onMounted, reactive, ref, watch, watchEffect } from 'vue';

interface LedgerAccount {
  id?: number;
  accountCode1: string | null;
  accountCode2: string | null;
  accountCode3: string | null;
  itemOrder: number | null;
  ledgerType: keyof typeof ledgerTypes | null;
  interestMethod: keyof typeof interestMethods | null;
  rate: string | null;
  rateType: keyof typeof rateTypes | null;
  graceDays: string | number | null;
  negativeRate: string | number | null;
  viewType: string | null;
}

interface BucketBasedRate {
  days1: number | null;
  days2: number | null;
  rate: number | null;
}

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  {
    path: '/module/settings/loanMaster/ledgerLoanConfigurations',
    label: 'Loan Master',
  },
  {
    path: '/module/settings/loanMaster/ledgerLoanConfigurations',
    label: 'Config Ledger Loan',
  },
];

const ledgerTypes = {
  I: 'Interest Sheet',
  L: 'Ledger',
};

const interestMethods = {
  S: 'Simple Interest',
  SE: 'Simple Interest Enterprise',
  SC: 'Simple Int.Compound on Expiry',
  CE: 'Compound Interest Enterprise',
  CW: 'Compound Interest Win',
  DI: 'Daily Interest',
  DA: 'Daily Amount',
  IS: 'Instalment wise Simple',
  IM: 'Instalment wise Month End Compounding',
  MC: 'Month End Compounding',
  I: 'RR',
};

const rateTypes = {
  S: 'single',
  B: 'Buckets based',
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
    name: 'itemOrder',
    label: 'Item Order',
    field: 'itemOrder',
    align: 'left',
    sortable: true,
  },

  {
    name: 'ledgerType',
    label: 'Ledger Type',
    field: 'ledgerType',
    align: 'left',
    sortable: true,
  },
  {
    name: 'accountCode1',
    label: 'Account Code 1',
    field: 'accountCode1',
    align: 'left',
  },
  {
    name: 'accountCode2',
    label: 'Account Code 2',
    field: 'accountCode2',
    align: 'left',
  },
  {
    name: 'accountCode3',
    label: 'Account Code 3',
    field: 'accountCode3',
    align: 'left',
  },

  {
    name: 'interestMethod',
    label: 'Interest Method',
    field: 'interestMethod',
    align: 'left',
    sortable: true,
  },
  {
    name: 'rateType',
    label: 'Rate Type',
    field: 'rateType',
    align: 'left',
    sortable: true,
  },
  {
    name: 'rate',
    label: 'Rate',
    field: 'rate',
    align: 'left',
  },
  {
    name: 'negativeRate',
    label: 'Negative Rate',
    field: 'negativeRate',
    align: 'left',
  },
  {
    name: 'graceDays',
    label: 'Grace Days',
    field: 'graceDays',
    align: 'left',
  },
  {
    name: 'viewType',
    label: 'View Type',
    field: 'viewType',
    align: 'left',
  },
];

const fields = columns.map((column) => column.field);

const accountCodeTypes = ref<{ label: string; value: string }[]>([]);
const editingRowIndex = ref<null | number>(null);
const isPerformingAction = ref(false);
const isDialogActive = ref(false);
const bucketBasedRateArr = ref<BucketBasedRate[]>([]);
const ledgerLoanConfigurations = ref<LedgerAccount[]>([]);
const tempConfig = reactive<Omit<LedgerAccount, 'id'>>({
  accountCode1: null,
  accountCode2: null,
  accountCode3: null,
  itemOrder: null,
  ledgerType: null,
  rate: null,
  interestMethod: null,
  rateType: null,
  graceDays: null,
  negativeRate: null,
  viewType: 'Customer,Court',
});
const bucketBasedRateInput = reactive<BucketBasedRate>({
  days1: null,
  days2: null,
  rate: null,
});

const submitHandler = async () => {
  const { itemOrder } = tempConfig;

  if (!isItemOrderValid(itemOrder!)) {
    onFailure({
      msg: 'Item order must be unique',
      position: 'center',
    });
    return;
  }

  const data: LedgerAccount = { ...tempConfig };

  if (editingRowIndex.value !== null) {
    data.id = ledgerLoanConfigurations.value[editingRowIndex.value].id;
  }

  const rsp = await api.post('configLedgerLoan', data);

  if (rsp.data) {
    onSuccess({
      msg:
        editingRowIndex.value !== null
          ? 'Updated successfully'
          : rsp.data.displayMessage,
    });
    await fetchLedgerLoanConfiguration();
  }

  isDialogActive.value = false;
};

const deleteConfig = (id: number) => {
  confirmDialog(async () => {
    const rsp = await api.delete(`configLedgerLoan/${id}`);
    if (rsp.data) {
      onSuccess({
        msg: rsp.data.displayMessage,
      });
      await fetchLedgerLoanConfiguration();
    }
  }, {});
};

const isItemOrderValid = (itemorder: number) =>
  !ledgerLoanConfigurations.value.some((item) => {
    if (
      editingRowIndex.value !== null &&
      ledgerLoanConfigurations.value[editingRowIndex.value].id === item.id
    ) {
      return false;
    } else {
      return item.itemOrder === itemorder;
    }
  });

const getMultiselectOptions = (obj: { [key: string]: string }) => {
  const optionsArr = [];

  for (let key in obj) {
    optionsArr.push({ value: key, label: obj[key] });
  }

  return optionsArr;
};

const addRateToBucket = () => {
  const { days1, days2, rate } = bucketBasedRateInput;
  if (
    !(Number.isFinite(days1) && Number.isFinite(days2) && Number.isFinite(rate))
  ) {
    return;
  }

  bucketBasedRateArr.value = [
    ...bucketBasedRateArr.value,
    { ...bucketBasedRateInput },
  ];
  fillRateFromBucket();
};

const removeRateFromBucket = (index: number) => {
  bucketBasedRateArr.value = [
    ...bucketBasedRateArr.value.slice(0, index),
    ...bucketBasedRateArr.value.slice(index + 1),
  ];

  fillRateFromBucket();
};

const fillRateFromBucket = () => {
  if (!bucketBasedRateArr.value.length) {
    tempConfig.rate = null;
    return;
  }
  tempConfig.rate = bucketBasedRateArr.value
    .map(({ days1, days2, rate }) => `${days1}-${days2}-${rate}`)
    .join(',');
};

const setInitialFormdata = () => {
  const row =
    editingRowIndex.value === null
      ? undefined
      : ledgerLoanConfigurations.value[editingRowIndex.value];

  tempConfig.accountCode1 = row?.accountCode1 || null;
  tempConfig.accountCode2 = row?.accountCode2 || null;
  tempConfig.accountCode3 = row?.accountCode3 || null;
  tempConfig.itemOrder = row?.itemOrder || null;
  tempConfig.ledgerType = row?.ledgerType || null;
  tempConfig.interestMethod = row?.interestMethod || null;
  tempConfig.graceDays = row?.graceDays || null;
  tempConfig.negativeRate = row?.negativeRate || null;
  tempConfig.viewType = row?.viewType || 'Customer,Court';
  tempConfig.rateType = row?.rateType || null;
  tempConfig.rate = row?.rate || null;

  if (row && row.rateType === 'B' && row.rate) {
    bucketBasedRateArr.value = row.rate.split(',').map((item) => {
      const [days1, days2, rate] = item.split('-').map(Number);
      return { days1, days2, rate };
    });
  }
};

const fetchLedgerLoanConfiguration = async () => {
  isPerformingAction.value = true;
  const rsp = await api('configLedgerLoan');

  if (rsp.data) {
    ledgerLoanConfigurations.value = rsp.data;
  }
  isPerformingAction.value = false;
};

onMounted(async () => {
  await fetchLedgerLoanConfiguration();
  const accountCodes = await api.get('accountCodeBySection/L');
  if (accountCodes.data) {
    accountCodeTypes.value = accountCodes.data.map(
      (code: { name: string; code: string }) => ({
        value: code.code,
        label: code.name,
      })
    );
  }
});

watch(
  () => tempConfig.rateType,
  (newValue, oldValue) => {
    if (oldValue !== null) {
      tempConfig.rate = null;
    }
    bucketBasedRateInput.days1 = null;
    bucketBasedRateInput.days2 = null;
    bucketBasedRateInput.rate = null;

    if (tempConfig.rateType === 'B') {
      fillRateFromBucket();
    }
  }
);

watch(
  () => tempConfig.rate,
  (newVal, oldVal) => {
    if (tempConfig.rateType === 'S') {
      if (oldVal !== null && Number.isNaN(+newVal!)) {
        tempConfig.rate = oldVal;
      }
    }
  }
);

watchEffect(() => {
  const { negativeRate, graceDays, rate } = tempConfig;
  if (rate === null) {
    tempConfig.rate = '';
  }
  if (negativeRate === '') {
    tempConfig.negativeRate = null;
  }
  if (graceDays === '') {
    tempConfig.graceDays = null;
  }
});
</script>

<style scoped></style>
