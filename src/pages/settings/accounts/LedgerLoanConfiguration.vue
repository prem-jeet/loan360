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
              <div class="col-12 text-h4">Account codes</div>
              <div class="col-auto">
                <q-btn
                  size="md"
                  v-if="configLedgerLoan.length"
                  label="Add Ledger Loan Configuration"
                  icon="add"
                  color="blue-7"
                  @click="null"
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
                <span>{{ props.row.itemOrder }}</span>
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
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { onMounted, ref } from 'vue';

interface LedgerAccount {
  id: number;
  accountCode1: string | null;
  accountCode2: string | null;
  accountCode3: string | null;
  itemOrder: number;
  ledgerType: string | null;
  interestMethod: string | null;
  rate: string | null;
  rateType: string | null;
  graceDays: number | null;
  negativeRate: string | null;
  viewType: string | null;
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
    sortable: true,
  },
  {
    name: 'accountCode2',
    label: 'Account Code 2',
    field: 'accountCode2',
    align: 'left',
    sortable: true,
  },
  {
    name: 'accountCode3',
    label: 'Account Code 3',
    field: 'accountCode3',
    align: 'left',
    sortable: true,
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
    sortable: true,
  },
  {
    name: 'negativeRate',
    label: 'Negative Rate',
    field: 'negativeRate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'graceDays',
    label: 'Grace Days',
    field: 'graceDays',
    align: 'left',
    sortable: true,
  },
  {
    name: 'viewType',
    label: 'View Type',
    field: 'viewType',
    align: 'left',
    sortable: true,
  },
];

const configLedgerLoan = ref<LedgerAccount[]>([]);

onMounted(async () => {
  const rsp = await api('configLedgerLoan');

  if (rsp.data) {
    configLedgerLoan.value = rsp.data;
  }
});
</script>

<style scoped></style>
