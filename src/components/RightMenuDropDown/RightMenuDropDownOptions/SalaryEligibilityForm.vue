<template>
  <q-form @submit.prevent="calculateAmount()">
    <div class="row q-col-gutter-xs">
      <div class="col-xs-12 col-sm-12 col-md-6">
        Monthly Salary<span class="text-red"> &nbsp;*</span>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input
          outlined
          dense
          size="sm"
          v-model="modalObj.monthlyRevenue"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        Interest Rate<span class="text-red"> &nbsp;*</span>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input
          outlined
          dense
          v-model="modalObj.rate"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        Tenure<span class="text-red"> &nbsp;*</span>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input
          outlined
          dense
          v-model="modalObj.tenure"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">Instalments</div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input outlined dense v-model="modalObj.instalments" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">Adv Instalments</div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input outlined dense v-model="modalObj.advInstalments" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        Net Salary Eligle for EMI %<span class="text-red"> &nbsp;*</span>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input
          outlined
          dense
          v-model="modalObj.marginPercent"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">Net Salary In Amt</div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input outlined dense v-model="modalObj.marginAmount" disable />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-select
          outlined
          dense
          v-model="ExpensesSelected"
          :options="Expenses"
          label="Expenses"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-3">
        <q-input
          outlined
          dense
          v-model="ExpensesAmount"
          ref="inputRef"
          :error="error && !ExpensesAmount"
          error-message=""
          label="Enter amount"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 q-pt-sm">
        <q-btn
          size="sm"
          color="light-blue"
          @click="add()"
          icon="fa-solid fa-check"
        />
        &nbsp;
        <q-btn
          size="sm"
          color="light-blue"
          @click="refresh()"
          icon="fa-solid fa-arrow-rotate-left"
        />
      </div>
    </div>
    <div
      class="column q-pl-lg-lg q-pt-sm"
      v-for="(item, index) in data.ExpensesArray"
      :key="index"
      style="height: 30px"
    >
      <div class="col-6 col-md-6">
        {{ item.field }}
      </div>
      <div class="col-4 col-md-6"></div>
      <div class="col-6 col-md-6 text-right">
        {{ item.value }}
        &emsp;
        <q-btn
          size="sm"
          color="light-blue"
          @click="edit(index)"
          icon="fa-solid fa-pen-to-square"
        />
        &nbsp;
        <q-btn
          size="sm"
          color="light-blue"
          @click="remove(index)"
          icon="fa-solid fa-xmark"
        />
      </div>
    </div>

    <div
      class="column q-pl-lg-lg"
      v-if="data.ExpensesArray.length > 0"
      style="height: 30px"
    >
      <div class="col-12 col-md-12">Total Expenses</div>
      <div class="col-12 col-md-12 text-center">
        <p class="q-pr-xl">&nbsp;{{ ExpensTotal }}</p>
      </div>
    </div>
    <p></p>
    <div class="row q-col-gutter-xs">
      <div class="col-xs-12 col-sm-12 col-md-6">
        Net Income Available for EMI
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input outlined dense disable v-model="modalObj.netAvailableIncome" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">Loan Amount</div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input
          outlined
          dense
          disable
          v-model="modalObj.calculatedLoanAmount"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6">Max Loan Amount</div>
      <div class="col-xs-12 col-sm-12 col-md-6">
        <q-input outlined dense disable v-model="modalObj.maxLoanAmount" />
      </div>
    </div>
    <p></p>
    <div class="row justify-center">
      <q-btn color="light-blue" label="reset" @click="reset" />
      &nbsp;
      <q-btn color="light-blue" label="Close" v-close-popup />
    </div>
  </q-form>
</template>
<script setup lang="ts">
import { number } from '@intlify/core-base';
import { ref, reactive, defineProps } from 'vue';
const error = ref(false);

const ExpensesSelected = ref('');
const ExpensesAmount = ref('');
// const ExpensesArray = ref([]);

const ExpensTotal = ref(0);

const props = defineProps({
  EligibilitymodalObj: {
    type: Object,
    required: true,
  },
});
interface EligibilityObject {
  [key: string]: string | number | null;
}
const modalObj = reactive<EligibilityObject>({ ...props.EligibilitymodalObj });

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
    calculateAmount();
    error.value = false;
  }
};
const remove = (index: number) => {
  const obj = data.ExpensesArray[index];
  const val = parseInt(obj['value'] as keyof typeof number);
  ExpensTotal.value -= val;
  data.ExpensesArray.splice(index, 1);
  calculateAmount();
};
const edit = (index: number) => {
  const obj = data.ExpensesArray[index];
  const val = parseInt(obj['value'] as keyof typeof number);
  ExpensTotal.value -= val;
  ExpensesSelected.value = obj['field'] as keyof typeof String;
  ExpensesAmount.value = obj['value'] as keyof typeof String;

  data.ExpensesArray.splice(index, 1);
  calculateAmount();
};

const refresh = () => {
  (ExpensesSelected.value = ''), (ExpensesAmount.value = '');
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

  modalObj.maxLoanAmount = Number(
    parseFloat(modalObj.calculatedLoanAmount as unknown as string).toFixed(2)
  );
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
