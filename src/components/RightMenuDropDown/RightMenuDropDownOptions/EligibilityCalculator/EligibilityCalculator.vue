<template>
  <q-card class="e-card" flat bordered>
    <q-item class="bg-light-blue-5 text-white q-pa-none q-ma-none">
      <q-item-section>
        <q-toolbar class="q-pa-none q-ma-none bg-purple-6">
          <p v-if="radio == 'bs'" class="text-subtitle2 q-pt-md q-px-md">
            Business Loan
          </p>
          <p v-if="radio == 'salary'" class="text-subtitle2 q-pt-md q-px-md">
            Salaried Loan
          </p>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-item-section>
    </q-item>
    <q-card-section style="max-height: 85vh" class="scroll">
      <div class="row q-pb-sm">
        <div class="col-xs-6 col-sm-6 col-md-6 q-px-sm">
          <q-radio
            v-model="radio"
            dense
            val="bs"
            label="Business Loan
"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-6 q-px-sm">
          <q-radio v-model="radio" dense val="salary" label="Salaried Loan" />
        </div>
      </div>
      <q-form @submit.prevent="calculateAmount()">
        <div :class="rowcss">
          <div :class="colcss">
            {{
              radio === 'bs'
                ? ' Monthly Business Sales / Receipt'
                : ' Monthly Salary'
            }}
            <span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colcss">
            <q-input
              outlined
              mask="#################"
              dense
              v-model="modalObj.monthlyRevenue"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">
            Interest Rate<span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colcss">
            <q-input
              outlined
              dense
              mask="###"
              v-model="modalObj.rate"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right"
              @blur="blur()"
              @update:model-value="(v) => test('rate', v as number)"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">
            Tenure<span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colcss">
            <q-input
              outlined
              dense
              mask="###"
              v-model="modalObj.tenure"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right"
              @blur="blur()"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">Instalments</div>
          <div :class="colcss">
            <q-input
              outlined
              dense
              mask="###"
              v-model="modalObj.instalments"
              input-class="text-right"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">Adv Instalments</div>
          <div :class="colcss">
            <q-input
              outlined
              dense
              mask="###"
              v-model="modalObj.advInstalments"
              input-class="text-right"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">
            {{ radio === 'bs' ? 'Margin %' : ' Net Salary Eligle for EMI %' }}
            <span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colcss">
            <q-input
              outlined
              dense
              mask="###"
              v-model="modalObj.marginPercent"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right"
              @blur="blur()"
              @update:model-value="(v) => test('marginPercent',  v as number)"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">
            {{ radio === 'bs' ? 'Margin in Amt' : 'Net Salary In Amt' }}
          </div>
          <div :class="colcss">
            <q-input
              filled
              outlined
              dense
              disable
              v-model="modalObj.marginAmount"
              input-class="text-right"
            />
          </div>
        </div>

        <ExpensesCalulation @updateToatal="ToatlUpdate" />

        <div :class="rowcss">
          <div :class="colcss">
            {{
              radio === 'bs'
                ? 'Net Income Available for EMI'
                : 'Net Salary Available for EMI'
            }}
          </div>
          <div :class="colcss">
            <q-input
              filled
              outlined
              dense
              disable
              v-model="modalObj.netAvailableIncome"
              input-class="text-right"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">Loan Amount</div>
          <div :class="colcss">
            <q-input
              outlined
              filled
              dense
              disable
              v-model="modalObj.calculatedLoanAmount"
              input-class="text-right"
            />
          </div>
        </div>
        <div v-if="radio === 'bs'" :class="rowcss">
          <div :class="colcss">LTV Cost Value</div>
          <div :class="colcss">
            <q-input
              outlined
              mask="############"
              dense
              v-model="modalObj.ltvCostValue"
              input-class="text-right"
            />
          </div>
        </div>
        <div v-if="radio === 'bs'" :class="rowcss">
          <div :class="colcss">"LTV %</div>
          <div :class="colcss">
            <q-input
              outlined
              dense
              mask="###"
              v-model="modalObj.ltvPercent"
              input-class="text-right"
              @blur="blur()"
              @update:model-value="(v) => test('ltvPercent', v as number)"
            />
          </div>
        </div>
        <div v-if="radio === 'bs'" :class="rowcss">
          <div :class="colcss">LTV Loan Amount</div>
          <div :class="colcss">
            <q-input
              outlined
              filled
              disable
              dense
              v-model="modalObj.ltvLoanAmount"
              input-class="text-right"
            />
          </div>
        </div>
        <div :class="rowcss">
          <div :class="colcss">Max Loan Amount</div>
          <div :class="colcss">
            <q-input
              outlined
              filled
              dense
              disable
              v-model="modalObj.maxLoanAmount"
              input-class="text-right"
            />
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <q-btn color="light-blue" label="reset" @click="reset" />
          &nbsp;
          <q-btn color="light-blue" label="Close" v-close-popup />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import ExpensesCalulation from './ExpensesCalulation.vue';

import { ref, reactive } from 'vue';
const radio = ref('bs');
const colcss = ref('col-xs-12 col-sm-12 col-md-6');
const rowcss = ref('row q-col-gutter-xs q-pt-sm');

interface EligibilityObject {
  [x: string]: any;
  monthlyRevenue: number | null;
  rate: number | null;
  tenure: number | null;
  instalments: number | null;
  advInstalments: number | null;
  marginPercent: number | null;
  netAvailableIncome: number | null;
  marginAmount: number | null;
  calculatedLoanAmount: number | null;
  ltvCostValue: number | null;
  ltvPercent: number | null;
  ltvLoanAmount: number | null;
  maxLoanAmount: number | null;
}

const modalObj = reactive<EligibilityObject>({
  instalments: null,
  advInstalments: null,
  monthlyRevenue: null,
  marginPercent: null,
  netAvailableIncome: null,
  tenure: null,
  rate: null,
  calculatedLoanAmount: null,
  ltvCostValue: null,
  ltvPercent: null,
  ltvLoanAmount: null,
  marginAmount: null,
  maxLoanAmount: null,
});

const ExpensTotal = ref(0);
const test = (key: string, value: number) => {
  if (value > 100) modalObj[key] = 100;
};

const reset = () => {
  modalObj.monthlyRevenue = null;
  modalObj.rate = null;
  modalObj.tenure = null;
  modalObj.instalments = null;
  modalObj.advInstalments = null;
  modalObj.marginPercent = null;
  modalObj.netAvailableIncome = null;
  modalObj.marginAmount = null;
  modalObj.calculatedLoanAmount = null;
  modalObj.ltvCostValue = null;
  modalObj.ltvPercent = null;
  modalObj.ltvLoanAmount = null;
  modalObj.maxLoanAmount = null;
};
const blur = () => {
  if (
    (modalObj.monthlyRevenue as number) > 0 &&
    (modalObj.marginPercent as number) > 0
  ) {
    calculateAmount();
  }
};

const calculateAmount = () => {
  modalObj.marginAmount =
    ((modalObj.monthlyRevenue as number) * (modalObj.marginPercent as number)) /
    100;
  modalObj.netAvailableIncome =
    modalObj.marginAmount - (ExpensTotal.value > 0 ? ExpensTotal.value : 0);
  modalObj.calculatedLoanAmount =
    (modalObj.netAvailableIncome * (modalObj.tenure as number)) /
    (1 +
      ((modalObj.rate as number) / 100) * ((modalObj.tenure as number) / 12));
  modalObj.calculatedLoanAmount = modalObj.calculatedLoanAmount / 1000;
  modalObj.calculatedLoanAmount = Number(
    parseFloat(modalObj.calculatedLoanAmount as unknown as string).toFixed(0)
  );
  modalObj.calculatedLoanAmount = modalObj.calculatedLoanAmount * 1000;

  if (modalObj.ltvPercent !== null && radio.value === 'bs') {
    modalObj.ltvLoanAmount =
      ((modalObj.ltvCostValue as number) * (modalObj.ltvPercent as number)) /
      100;
    modalObj.ltvLoanAmount = modalObj.ltvLoanAmount / 1000;
    modalObj.ltvLoanAmount = Number(
      parseFloat(modalObj.ltvLoanAmount as unknown as string).toFixed(0)
    );
    modalObj.ltvLoanAmount = modalObj.ltvLoanAmount * 1000;
    modalObj.maxLoanAmount =
      modalObj.ltvLoanAmount >= modalObj.calculatedLoanAmount
        ? modalObj.calculatedLoanAmount
        : modalObj.ltvLoanAmount;
    modalObj.maxLoanAmount = Number(
      parseFloat(modalObj.maxLoanAmount as unknown as string).toFixed(2)
    );
  } else {
    modalObj.maxLoanAmount = Number(
      parseFloat(modalObj.calculatedLoanAmount as unknown as string).toFixed(2)
    );
  }
};

const ToatlUpdate = (val: any) => {
  ExpensTotal.value = val;
  calculateAmount();
};
</script>
<style scoped>
.row-with-border {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}
.e-card {
  width: 1000px;
}
.q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
