<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :grid="$q.screen.width < 830"
          :rows="configLedgerLoan"
          :columns="columns"
          table-header-class="bg-deep-purple-10 text-white"
        >
          <template v-slot:top>
            <div class="row items-center q-gutter-md">
              <div class="col-12 text-h4">Ledger Loan Configuration</div>
              <div class="col-auto">
                <q-btn
                  size="md"
                  v-if="configLedgerLoan.length"
                  label="Add Ledger Loan Configuration"
                  icon="add"
                  color="blue-7"
                  @click="
                    mode = 'new';
                    resetHandler();
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
                      mode = 'edit';
                      resetHandler(props.rowIndex);
                      isDialogActive = true;
                    "
                  />
                  <q-btn
                    padding="sm"
                    icon="delete"
                    size="xs"
                    flat
                    color="red"
                  />
                </q-btn-group>
              </q-td>
              <q-td key="ledgerType" :props="props">
                <span>{{
                  ledgerTypes[props.row.ledgerType as keyof typeof ledgerTypes]
                }}</span>
              </q-td>
              <q-td key="accountCode1" :props="props">
                <span>{{ props.row.accountCode1 }}</span>
              </q-td>
              <q-td key="accountCode2" :props="props">
                <span>{{ props.row.accountCode2 }}</span>
              </q-td>
              <q-td key="accountCode3" :props="props">
                <span>{{ props.row.accountCode3 }}</span>
              </q-td>
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
              <q-td key="rate" :props="props">
                <span>{{ props.row.rate }}</span>
              </q-td>
              <q-td key="negativeRate" :props="props">
                <span>{{ props.row.negativeRate }}</span>
              </q-td>
              <q-td key="graceDays" :props="props">
                <span>{{ props.row.graceDays }}</span>
              </q-td>
              <q-td key="viewType" :props="props">
                <span>{{ props.row.viewType }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <q-dialog v-model="isDialogActive" persistent>
    <q-card :style="{ minWidth: '40vw' }">
      <q-card-section class="row items-center bg-grey-2">
        <div class="text-h6">Ledger loan configuration</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-form @submit.prevent="submitHandler" @reset="resetHandler">
        <q-card-section :style="{ maxHeight: '70vh' }" class="scroll">
          <div class="row justify-evenly q-gutter-md">
            <!-- item order -->
            <div class="col">
              <q-input
                type="number"
                v-model.number="tempConfig.itemOrder"
                label="Item order"
                :min="1"
                :rules="[(val:string) => val!==null && val!=='']"
              />
            </div>
            <!-- ledger type -->
            <div class="col">
              <q-select
                v-model="tempConfig.ledgerType"
                label="Ledger Type"
                :options="getMultiselectOptions(ledgerTypes)"
                emit-value
                map-options
                menu-shrink
                :rules="[(val) => val !== null]"
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
              />
            </div>
            <!-- account code 3 -->
            <div class="col" v-if="tempConfig.ledgerType === 'L'">
              <q-select
                v-model="tempConfig.accountCode3"
                label="Accout Code 3"
                :options="accountCodeTypes"
                options-dense
                map-options
                menu-shrink
                emit-value
                clearable
              />
            </div>
          </div>

          <template v-if="tempConfig.ledgerType === 'I'">
            <!-- interest methods -->
            <div class="row justify-evenly q-gutter-md">
              <div class="col">
                <q-select
                  v-model="tempConfig.interestMethod"
                  label="Interest Methods"
                  :options="getMultiselectOptions(interestMethods)"
                  map-options
                  menu-shrink
                  emit-value
                  options-dense
                  :rules="[(val:string) => val !== null]"
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
                  :min="0"
                />
              </div>
            </div>

            <div
              class="row justify-evenly q-gutter-md"
              v-if="tempConfig.rateType === 'B'"
            >
              <div class="col flex items-center">
                <!-- rate -> bucket -->
                <div class="row justify-evenly items-center">
                  <q-input
                    class="col-3"
                    dense
                    outlined
                    label="Days"
                    v-model.number="bucketBasedRateInput.days1"
                    type="number"
                    hide-bottom-space
                  />
                  <q-input
                    class="col-3"
                    dense
                    outlined
                    label="Days"
                    v-model.number="bucketBasedRateInput.days2"
                    type="number"
                    hide-bottom-space
                  />
                  <q-input
                    class="col-3"
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
                      @click.stop="addRate"
                      type="button"
                    />
                  </div>
                </div>
              </div>
              <!-- rate -> bucket display-->
              <div class="col">
                <div class="row">
                  <div
                    class="col-auto"
                    v-for="(rate, index) in bucketBasedRateArr"
                    :key="`${rate.days1}-${rate.days2}-${rate.rate}`"
                  >
                    <q-chip removable @remove="() => removeRate(index)">
                      {{ `${rate.days1}-${rate.days2}-${rate.rate}` }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
            <div class="row justify-evenly q-gutter-md">
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
          <div class="col-12">
            <q-input
              v-model="tempConfig.viewType"
              label="View type"
              :rules="[(val) => val !== null && val !== '']"
              clearable
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-py-md bg-grey-2">
          <q-btn
            :label="mode === 'new' ? 'Add' : 'Save '"
            :icon="mode === 'new' ? 'add' : 'save '"
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
import { onMounted, reactive, ref } from 'vue';

interface LedgerAccount {
  id: number;
  accountCode1: string | null;
  accountCode2: string | null;
  accountCode3: string | null;
  itemOrder: number | null;
  ledgerType: keyof typeof ledgerTypes | null;
  interestMethod: keyof typeof interestMethods | null;
  rate: string | null;
  rateType: keyof typeof rateTypes | null;
  graceDays: number | null;
  negativeRate: string | null;
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
    path: '/module/settings/loanMaster/configLedgerLoan',
    label: 'Loan Master',
  },
  {
    path: '/module/settings/loanMaster/configLedgerLoan',
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

const accountCodeTypes = ref<{ label: string; value: string }[]>([]);

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

const mode = ref<'edit' | 'new'>('new');
const isDialogActive = ref(true);
const tempConfig = reactive<LedgerAccount>({
  id: -1,
  accountCode1: null,
  accountCode2: null,
  accountCode3: null,
  itemOrder: null,
  ledgerType: null,
  interestMethod: null,
  rate: null,
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

const bucketBasedRateArr = ref<BucketBasedRate[]>([]);

const configLedgerLoan = ref<LedgerAccount[]>([]);

const isAccountcodeValid = () => {
  const check =
    tempConfig.accountCode1 !== null || tempConfig.accountCode2 !== null;
  if (tempConfig.ledgerType === 'I') {
    return check;
  }
  if (tempConfig.ledgerType === 'L') {
    return check || tempConfig.accountCode3 !== null;
  }
  return true;
};

const submitHandler = () => {
  console.log('submitted');
};

const resetHandler = (index?: number) => {
  if (mode.value === 'new') {
    tempConfig.accountCode1 = null;
    tempConfig.accountCode2 = null;
    tempConfig.accountCode3 = null;
    tempConfig.itemOrder = null;
    tempConfig.ledgerType = null;
    tempConfig.interestMethod = null;
    tempConfig.rate = null;
    tempConfig.rateType = null;
    tempConfig.graceDays = null;
    tempConfig.negativeRate = null;
    tempConfig.viewType = 'Customer,Court';
  } else {
    if (index !== undefined) {
      const row = configLedgerLoan.value[index];
      tempConfig.accountCode1 = row.accountCode1;
      tempConfig.accountCode2 = row.accountCode2;
      tempConfig.accountCode3 = row.accountCode3;
      tempConfig.itemOrder = row.itemOrder;
      tempConfig.ledgerType = row.ledgerType;
      tempConfig.interestMethod = row.interestMethod;
      tempConfig.rate = row.rate;
      tempConfig.rateType = row.rateType;
      tempConfig.graceDays = row.graceDays;
      tempConfig.negativeRate = row.negativeRate;
      tempConfig.viewType = row.viewType;
    }
  }
};
const getMultiselectOptions = (obj: { [key: string]: string }) => {
  const optionsArr = [];

  for (let key in obj) {
    optionsArr.push({ value: key, label: obj[key] });
  }

  return optionsArr;
};

const addRate = () => {
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
};

const removeRate = (index: number) => {
  bucketBasedRateArr.value = [
    ...bucketBasedRateArr.value.slice(0, index),
    ...bucketBasedRateArr.value.slice(index + 1),
  ];
};
onMounted(async () => {
  const rsp = await api('configLedgerLoan');

  if (rsp.data) {
    configLedgerLoan.value = rsp.data;
  }

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
</script>

<style scoped></style>
