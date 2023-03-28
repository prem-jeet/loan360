<template>
  <q-card :style="{ minWidth: '40vw' }" flat bordered>
    <q-card-section class="bg-purple-6 text-white row items-center">
      <div class="text-subtitle2">
        {{ loanType == 'bl' ? 'Business Loan' : 'Salaried Loan' }}
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
          <q-radio v-model="loanType" dense val="bl" label="Business Loan" />
          <q-radio v-model="loanType" densev val="sl" label="Salaried Loan" />
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

      <q-form class="q-mt-md">
        <div :class="rowCss">
          <div :class="colCss">
            {{
              loanType === 'bl'
                ? ' Monthly Business Sales / Receipt'
                : ' Monthly Salary'
            }}
          </div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              hide-bottom-space
              v-model.number="monthlyRevenue"
              :error="!monthlyRevenue"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Interest Rate</div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              hide-bottom-space
              v-model.number="percetageValues.rate"
              :error="percetageValues.rate === null"
              input-class="text-right remove-input-number-indicator"
              @update:model-value="(v) => limitPercetageInput('rate', v as number)"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Tenure (Months)</div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              hide-bottom-space
              v-model.number="modalObj.tenure"
              :error="modalObj.tenure === null"
              input-class="text-right remove-input-number-indicator"
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
              v-model.number="modalObj.instalments"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">Adv. Instalments</div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              v-model.number="modalObj.advInstalments"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">
            {{
              loanType === 'bl' ? 'Margin % ' : ' Net Salary Eligle for EMI % '
            }}
          </div>
          <div :class="colCss">
            <q-input
              outlined
              dense
              type="number"
              hide-bottom-space
              :error="percetageValues.margin === null"
              v-model.number="percetageValues.margin"
              input-class="text-right remove-input-number-indicator"
              @update:model-value="(v) => limitPercetageInput('margin', v as number)"
            />
          </div>
        </div>
        <div :class="rowCss">
          <div :class="colCss">
            {{ loanType === 'bl' ? 'Margin in Amt' : 'Net Salary In Amt' }}
          </div>
          <div :class="colCss">
            <q-input
              filled
              type="number"
              outlined
              dense
              disable
              v-model.number="marginAmount"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>

        <ExpensesCalulation @updateToatal="updateTotalExpense" />

        <div :class="rowCss">
          <div :class="colCss">
            {{
              loanType === 'bl'
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
              v-model.number="netAvailableIncome"
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
              v-model.number="loanAmount"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div v-if="loanType === 'bl'" :class="rowCss">
          <div :class="colCss">LTV Cost Value</div>
          <div :class="colCss">
            <q-input
              outlined
              type="number"
              dense
              v-model.number="modalObj.ltvCostValue"
              input-class="text-right remove-input-number-indicator"
            />
          </div>
        </div>
        <div v-if="loanType === 'bl'" :class="rowCss">
          <div :class="colCss">"LTV %</div>
          <div :class="colCss">
            <q-input
              outlined
              dense
              type="number"
              v-model.number="percetageValues.ltv"
              input-class="text-right remove-input-number-indicator"
              @update:model-value="(v) => limitPercetageInput('ltv', v as number)"
            />
          </div>
        </div>
        <div v-if="loanType === 'bl'" :class="rowCss">
          <div :class="colCss">LTV Loan Amount</div>
          <div :class="colCss">
            <q-input
              outlined
              filled
              disable
              dense
              type="number"
              v-model.number="ltvLoanAmount"
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
              v-model.number="maxLoanAmount"
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
import { ref, reactive, computed, watch } from 'vue';

const loanType = ref('bl');
const colCss = 'col-xs-12 col-sm-12 col-md-6';
const rowCss = 'row q-col-gutter-xs q-pt-sm';

const modalObj = reactive<EligibilityObject>({
  instalments: null,
  advInstalments: null,
  tenure: null,
  ltvCostValue: null,
});

const monthlyRevenue = ref<number | null>(null);

const percetageValues = reactive<{
  margin: number | null;
  rate: number | null;
  ltv: number | null;
}>({
  margin: null,
  rate: null,
  ltv: null,
});

const expensTotal = ref(0);

const marginAmount = computed(() => {
  const { margin } = percetageValues;

  if (monthlyRevenue.value && margin) {
    return +(monthlyRevenue.value * (margin / 100)).toFixed(2);
  }

  return null;
});

const netAvailableIncome = computed(() => {
  if (marginAmount.value) {
    return marginAmount.value - (expensTotal.value || 0);
  }
  return null;
});

const loanAmount = computed(() => {
  const { tenure } = modalObj;
  const { rate } = percetageValues;

  if (netAvailableIncome.value && tenure !== null && rate !== null) {
    return Math.round(
      (netAvailableIncome.value * tenure) / (1 + (rate / 100) * (tenure / 12))
    );
  }
  return null;
});

const ltvLoanAmount = computed(() => {
  const { ltvCostValue } = modalObj;
  const { ltv: ltvPercent } = percetageValues;
  if (ltvCostValue && ltvPercent) {
    const ltvLoanAmount = Math.round((ltvCostValue * ltvPercent) / 100);
    return Math.round(ltvLoanAmount / 1000) * 1000;
  }
  return null;
});

const maxLoanAmount = computed(() => {
  if (!loanAmount.value) {
    return null;
  }

  if (loanType.value === 'sl') {
    return +loanAmount.value.toFixed(2);
  }

  if (!ltvLoanAmount.value) {
    return null;
  }

  return +(
    ltvLoanAmount.value >= loanAmount.value
      ? loanAmount.value
      : ltvLoanAmount.value
  ).toFixed(2);
});

const limitPercetageInput = (key: string, percentValue: number) => {
  const newValue = Math.min(100, Math.max(0, percentValue));
  percetageValues[key as keyof typeof percetageValues] = newValue;
};

const reset = () => {
  monthlyRevenue.value = null;
  modalObj.tenure = null;
  modalObj.instalments = null;
  modalObj.advInstalments = null;
  modalObj.ltvCostValue = null;

  percetageValues.rate = null;
  percetageValues.margin = null;
  percetageValues.ltv = null;
};

const updateTotalExpense = (val: number) => {
  expensTotal.value = val;
};

watch(monthlyRevenue, (newVal, oldVal) => {
  if (oldVal === null) {
    modalObj.tenure = 0;
    percetageValues.rate = 0;
  }
});
</script>
<style scoped></style>
