<template>
  <q-card :style="{ minWidth: '40vw' }" flat bordered>
    <q-card-section class="bg-purple-6 text-white row items-center">
      <div class="text-subtitle2">
        {{ loanType == 'bs' ? 'Business Loan' : 'Salaried Loan' }}
      </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section
      :style="{ height: 'calc(100% - 65.6px)' }"
      class="q-px-xs-sm q-px-sm-md scroll"
    >
      <div class="row items-center q-px-xs-md">
        <div class="col flex q-gutter-x-lg q-gutter-y-sm">
          <q-radio v-model="loanType" dense val="bs" label="Business Loan" />
          <q-radio
            v-model="loanType"
            dense
            val="salary"
            label="Salaried Loan"
          />
        </div>
        <q-btn
          class="col-auto"
          color="red"
          @click="reset"
          icon="fa-solid fa-rotate-left"
          size="xs"
        >
          <q-tooltip>Reset</q-tooltip>
        </q-btn>
      </div>

      <q-form @submit.prevent="calculateAmount()" class="q-mt-md">
        <div :class="rowCss">
          <div :class="colCss">
            {{
              loanType === 'bs'
                ? ' Monthly Business Sales / Receipt'
                : ' Monthly Salary'
            }}
            <span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              hide-bottom-space
              v-model="modalObj.monthlyRevenue"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">
            Interest Rate<span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              hide-bottom-space
              v-model.number="modalObj.rate"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right remove-input-number-indicator"
              @blur="blur()"
              @update:model-value="(v) => test('rate', v as number)"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">
            Tenure<span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              hide-bottom-space
              v-model="modalObj.tenure"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right remove-input-number-indicator"
              @blur="blur()"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Instalments</div>
          <div :class="colCss">
            <q-input
              outlined
              dense
              type="number"
              v-model="modalObj.instalments"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Adv Instalments</div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              v-model="modalObj.advInstalments"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">
            {{
              loanType === 'bs' ? 'Margin %' : ' Net Salary Eligle for EMI %'
            }}
            <span class="text-red"> &nbsp;*</span>
          </div>
          <div :class="colCss">
            <q-input
              outlined
              dense
              type="number"
              hide-bottom-space
              v-model="modalObj.marginPercent"
              :rules="[(val: any) => !!val || '']"
              input-class="text-right remove-input-number-indicator"
              @blur="blur()"
              @update:model-value="(v) => test('marginPercent', v as number)"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">
            {{ loanType === 'bs' ? 'Margin in Amt' : 'Net Salary In Amt' }}
          </div>
          <div :class="colCss">
            <q-input
              filled
              type="number"
              outlined
              dense
              disable
              v-model="modalObj.marginAmount"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>

        <ExpensesCalulation @updateToatal="ToatlUpdate" />

        <div :class="rowCss">
          <div :class="colCss">
            {{
              loanType === 'bs'
                ? 'Net Income Available for EMI'
                : 'Net Salary Available for EMI'
            }}
          </div>
          <div :class="colCss">
            <q-input
              mask="############.##"
              filled
              outlined
              type="number"
              dense
              disable
              v-model="modalObj.netAvailableIncome"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Loan Amount</div>
          <div :class="colCss">
            <q-input
              outlined
              filled
              dense
              disable
              type="number"
              v-model="modalObj.calculatedLoanAmount"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div v-if="loanType === 'bs'" :class="rowCss">
          <div :class="colCss">LTV Cost Value</div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              v-model="modalObj.ltvCostValue"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div v-if="loanType === 'bs'" :class="rowCss">
          <div :class="colCss">"LTV %</div>
          <div :class="colCss">
            <q-input
              outlined
              dense
              type="number"
              v-model="modalObj.ltvPercent"
              input-class="text-right remove-input-number-indicator"
              @blur="blur()"
              @update:model-value="(v) => test('ltvPercent', v as number)"
            />
          </div>
        </div>
        <div v-if="loanType === 'bs'" :class="rowCss">
          <div :class="colCss">LTV Loan Amount</div>
          <div :class="colCss">
            <q-input
              outlined
              filled
              disable
              dense
              type="number"
              v-model="modalObj.ltvLoanAmount"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Max Loan Amount</div>
          <div :class="colCss">
            <q-input
              outlined
              filled
              dense
              disable
              type="number"
              v-model="modalObj.maxLoanAmount"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import ExpensesCalulation from './ExpensesCalulation.vue';
import { EligibilityObject } from './type';
import { ref, reactive } from 'vue';
const loanType = ref('bs');
const colCss = 'col-xs-12 col-sm-12 col-md-6';
const rowCss = 'row q-col-gutter-xs q-pt-sm';

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

const expensTotal = ref(0);
const test = (key: string, value: number) => {
  console.log('value', value, typeof value);
  if (value > 100) modalObj[key as keyof EligibilityObject] = 100;
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
    modalObj.marginAmount - (expensTotal.value > 0 ? expensTotal.value : 0);
  modalObj.calculatedLoanAmount =
    (modalObj.netAvailableIncome * (modalObj.tenure as number)) /
    (1 +
      ((modalObj.rate as number) / 100) * ((modalObj.tenure as number) / 12));
  modalObj.calculatedLoanAmount = modalObj.calculatedLoanAmount / 1000;
  modalObj.calculatedLoanAmount = +modalObj.calculatedLoanAmount.toFixed(0);
  modalObj.calculatedLoanAmount = modalObj.calculatedLoanAmount * 1000;

  if (modalObj.ltvPercent !== null && loanType.value === 'bs') {
    modalObj.ltvLoanAmount =
      ((modalObj.ltvCostValue as number) * (modalObj.ltvPercent as number)) /
      100;
    modalObj.ltvLoanAmount = modalObj.ltvLoanAmount / 1000;
    modalObj.ltvLoanAmount = +modalObj.ltvLoanAmount.toFixed(0);
    modalObj.ltvLoanAmount = modalObj.ltvLoanAmount * 1000;
    modalObj.maxLoanAmount =
      modalObj.ltvLoanAmount >= modalObj.calculatedLoanAmount
        ? modalObj.calculatedLoanAmount
        : modalObj.ltvLoanAmount;
    modalObj.maxLoanAmount = +modalObj.maxLoanAmount.toFixed(2);
  } else {
    modalObj.maxLoanAmount = +modalObj.calculatedLoanAmount.toFixed(2);
  }
};

const ToatlUpdate = (val: number) => {
  expensTotal.value = val;
  calculateAmount();
};
</script>
<style scoped></style>
