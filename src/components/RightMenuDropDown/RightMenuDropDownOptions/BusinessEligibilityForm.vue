<template>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.monthlyRevenue"
        label="Monthly Business Sales / Receipt"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input outlined v-model="modalObj.rate" label="Interest Rate" />
    </div>
  </div>
  <p></p>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input outlined v-model="modalObj.tenure" label="Tenure" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input outlined v-model="modalObj.instalments" label="Instalments" />
    </div>
  </div>

  <p></p>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.advInstalments"
        label="Adv Instalments"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input outlined v-model="modalObj.marginPercent" label="Margin %" />
    </div>
  </div>
  <p></p>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.marginAmount"
        disable
        label="Margin in Amt"
      />
    </div>
  </div>
  <p></p>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">
      <q-select
        outlined
        v-model="ExpensesSelected"
        :options="Expenses"
        label="Expenses"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">
      <q-input
        outlined
        v-model="ExpensesAmount"
        ref="inputRef"
        :error="error && !ExpensesAmount"
        error-message="Enter amount"
        label="Enter amount"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm q-pt-sm">
      <q-btn color="light-blue" @click="add()" icon="fa-solid fa-check" />
      &nbsp;
      <q-btn
        color="light-blue"
        @click="refresh()"
        icon="fa-solid fa-arrow-rotate-left"
      />
    </div>
  </div>
  <div
    class="row q-col-gutter-xs text-center q-pa-md"
    v-for="(item, index) in data.ExpensesArray"
    :key="index"
  >
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">
      {{ item.field }}
    </div>

    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">{{ item.value }}</div>
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">
      <q-btn
        color="light-blue"
        @click="edit(index)"
        icon="fa-solid fa-pen-to-square"
      />
      &nbsp;
      <q-btn
        color="light-blue"
        @click="remove(index)"
        icon="fa-solid fa-xmark"
      />
    </div>
  </div>
  <div
    v-if="data.ExpensesArray.length > 0"
    class="row q-col-gutter-xs text-center q-pa-md"
  >
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">Total Expenses</div>
    <div class="col-xs-12 col-sm-12 col-md-4 q-px-sm">
      {{ ExpensTotal }}
    </div>
  </div>
  <p></p>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.netAvailableIncome"
        label="Net Income Available for EMI"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.calculatedLoanAmount"
        label="Loan Amount"
      />
    </div>
  </div>
  <p></p>
  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.ltvCostValue"
        label="LTV Cost Value"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input outlined v-model="modalObj.ltvPercent" label="LTV %" />
    </div>
  </div>
  <p></p>

  <div class="row q-col-gutter-xs">
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.ltvLoanAmount"
        label="LTV Loan Amount"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
      <q-input
        outlined
        v-model="modalObj.maxLoanAmount"
        label="Max Loan Amount"
      />
    </div>
  </div>
  <p></p>

  <div class="row justify-center">
    <q-btn
      color="light-blue"
      label="Check"
      @click="calculateAmount(modalObj)"
    />
    &nbsp;
    <q-btn color="light-blue" label="Close" v-close-popup />
  </div>
</template>
<script setup lang="ts">
import { number } from '@intlify/core-base';
import { ref, reactive } from 'vue';
const error = ref(false);

const ExpensesSelected = ref('');
const ExpensesAmount = ref('');
// const ExpensesArray = ref([]);

const ExpensTotal = ref(0);
interface MyObject {
  instalments: number | null;
  advInstalments: number | null;
  monthlyRevenue: number | null;
  marginPercent: number | null;
  netAvailableIncome: number | null;
  tenure: number | null;
  rate: any;
  calculatedLoanAmount: any;
  ltvCostValue: any;
  ltvPercent: any;
  ltvLoanAmount: any;

  [key: string]: string | number | null;
}

const modalObj = reactive<MyObject>({
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
});

const Expenses = ref([
  'Existing EMI',
  'House Hold Expenses',
  'Labour Expenses',
  'Other',
  'Purchase Expenses',
  'Rent',
  'Salary Expenses',
  'Third Party',
  'Transpotation',
  'Utility Bills',
]);

interface ArrayObject {
  [key: string]: string | number | null;
}

interface MyComponentData {
  ExpensesArray: ArrayObject[];
}
const data = reactive<MyComponentData>({
  ExpensesArray: [],
});

const add = () => {
  if (!ExpensesAmount.value) {
    error.value = true;
  } else {
    data.ExpensesArray.push({
      field: ExpensesSelected.value,
      value: ExpensesAmount.value,
    });
    let num = parseInt(ExpensesAmount.value);
    ExpensTotal.value += num;
    ExpensesSelected.value = '';
    ExpensesAmount.value = '';
    calculateAmount(modalObj);
  }
};
const remove = (index: number) => {
  const obj = data.ExpensesArray[index];
  const val = parseInt(obj['value'] as keyof typeof number);
  ExpensTotal.value -= val;
  data.ExpensesArray.splice(index, 1);
  calculateAmount(modalObj);
};
const edit = (index: number) => {
  const obj = data.ExpensesArray[index];
  const val = parseInt(obj['value'] as keyof typeof number);
  ExpensTotal.value -= val;
  ExpensesSelected.value = obj['field'] as keyof typeof String;
  ExpensesAmount.value = obj['value'] as keyof typeof String;

  data.ExpensesArray.splice(index, 1);
  calculateAmount(modalObj);
};

const refresh = () => {
  (ExpensesSelected.value = ''), (ExpensesAmount.value = '');
};

const calculateAmount = (value: MyObject) => {
  if (!modalObj.ltvCostValue) modalObj.ltvCostValue = modalObj.ltvCostValue;
  modalObj.rate = value.rate
    ? value.rate
    : modalObj.finalRate !== undefined
    ? modalObj.finalRate
    : 0;
  if (!modalObj.tenure)
    modalObj.tenure =
      (modalObj.instalments ? modalObj.instalments : 0) +
      (modalObj.advInstalments ? modalObj.advInstalments : 0);
  modalObj.marginAmount =
    ((modalObj.monthlyRevenue as number) * (modalObj.marginPercent as number)) /
    100;
  modalObj.netAvailableIncome =
    modalObj.marginAmount - (ExpensTotal.value > 0 ? ExpensTotal.value : 0);
  modalObj.calculatedLoanAmount =
    (modalObj.netAvailableIncome * modalObj.tenure) /
    (1 + (modalObj.rate / 100) * (modalObj.tenure / 12));
  modalObj.calculatedLoanAmount = modalObj.calculatedLoanAmount / 1000;
  modalObj.calculatedLoanAmount = Number(
    parseFloat(modalObj.calculatedLoanAmount).toFixed(0)
  );
  modalObj.calculatedLoanAmount = modalObj.calculatedLoanAmount * 1000;

  if (modalObj.ltvPercent !== null) {
    modalObj.ltvLoanAmount =
      (modalObj.ltvCostValue * modalObj.ltvPercent) / 100;
    modalObj.ltvLoanAmount = modalObj.ltvLoanAmount / 1000;
    modalObj.ltvLoanAmount = Number(
      parseFloat(modalObj.ltvLoanAmount).toFixed(0)
    );
    modalObj.ltvLoanAmount = modalObj.ltvLoanAmount * 1000;
    modalObj.maxLoanAmount = Number(
      parseFloat(
        modalObj.ltvLoanAmount >= modalObj.calculatedLoanAmount
          ? modalObj.calculatedLoanAmount
          : modalObj.ltvLoanAmount
      ).toFixed(2)
    );
  } else {
    modalObj.maxLoanAmount = Number(
      parseFloat(modalObj.calculatedLoanAmount).toFixed(2)
    );
  }
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
</style>
