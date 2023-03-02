<template>
  <q-form @submit.prevent="calculateAmount()">
    <div :class="rowcss">
      <div :class="colcss">
        Monthly Salary<span class="text-red"> &nbsp;*</span>
      </div>
      <div :class="colcss">
        <q-input
          outlined
          dense
          size="sm"
          v-model="modalObj.monthlyRevenue"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
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
          v-model="modalObj.rate"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">Tenure<span class="text-red"> &nbsp;*</span></div>
      <div :class="colcss">
        <q-input
          outlined
          dense
          v-model="modalObj.tenure"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">Instalments</div>
      <div :class="colcss">
        <q-input outlined dense v-model="modalObj.instalments" />
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">Adv Instalments</div>
      <div :class="colcss">
        <q-input outlined dense v-model="modalObj.advInstalments" />
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">
        Net Salary Eligle for EMI %<span class="text-red"> &nbsp;*</span>
      </div>
      <div :class="colcss">
        <q-input
          outlined
          dense
          v-model="modalObj.marginPercent"
          :rules="[(val) => !!val || '']"
          @blur="blur()"
        />
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">Net Salary In Amt</div>
      <div :class="colcss">
        <q-input
          filled
          outlined
          dense
          v-model="modalObj.marginAmount"
          disable
        />
      </div>
    </div>
    <div :class="rowcss" class="q-pb-sm">
      <div :class="colcss">Expenses</div>
    </div>
    <div class="row q-col-gutter-xs q-pb-xs">
      <div :class="colcss">
        <q-select
          outlined
          dense
          ref="inputRef"
          :error="error && !ExpensesSelected"
          error-message=""
          v-model="ExpensesSelected"
          :options="Expenses"
          label="Expenses"
        />
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6">
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
    </div>

    <div class="row q-col-gutter-xs q-pt-sm justify-end">
      <q-btn
        size="sm"
        class="q-pl-md"
        color="light-blue"
        @click="add()"
        icon="fa-solid fa-plus"
      >
        <q-tooltip> Add Expenses</q-tooltip>
      </q-btn>
      &nbsp;
      <q-btn
        size="sm"
        class="q-pl-md"
        color="light-blue"
        @click="refresh()"
        icon="fa-solid fa-arrow-rotate-left"
        ><q-tooltip> clear</q-tooltip></q-btn
      >
    </div>
    <div
      class="column q-pl-lg-lg q-pt-sm"
      v-for="(item, index) in data.ExpensesArray"
      :key="index"
      style="height: 30px"
    >
      <div v-if="editIndex !== index" class="text-label col-6 col-md-6">
        {{ item.field }}
      </div>
      <div v-if="editIndex !== index" class="col-4 col-md-6"></div>
      <div
        v-if="editIndex !== index"
        class="text-label col-6 col-md-6 text-right"
      >
        {{ item.value }}
        &emsp;
        <q-btn
          size="xs"
          color="blue"
          @click="edit(index)"
          icon="fa-solid fa-pen-to-square"
          ><q-tooltip> Edit amount</q-tooltip></q-btn
        >
        &nbsp;
        <q-btn
          size="xs"
          color="red"
          @click="remove(index)"
          icon="fa-solid fa-xmark"
          ><q-tooltip> Delete</q-tooltip></q-btn
        >
      </div>

      <div v-else class="column">
        <div class="text-label col-6 col-md-6 q-pt-xs">
          <select id="colors" v-model="editExpensesSelected">
            <option v-for="item in Expenses" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="text-label col-6 col-md-6"></div>
        <div class="text-label col-6 col-md-6 text-right">
          <input
            type="text"
            :placeholder="errormsg"
            v-model="editExpensesAmount"
          />
          &nbsp;
          <q-btn
            size="xs"
            color="blue"
            @click="editSave()"
            icon="fa-solid fa-check"
            ><q-tooltip> Edit amount</q-tooltip></q-btn
          >
          &nbsp;
          <q-btn
            size="xs"
            color="red"
            @click="Editremove(index)"
            icon="fa-solid fa-xmark"
            ><q-tooltip> Delete</q-tooltip></q-btn
          >
        </div>
      </div>
    </div>

    <div
      class="column q-pl-lg-lg q-pt-sm"
      v-if="data.ExpensesArray.length > 0"
      style="height: 30px"
    >
      <div class="text-label col-12 col-md-12">Total Expenses</div>
      <div class="col-12 col-md-12 text-center">
        <p class="text-label q-pr-xl">{{ ExpensTotal }}</p>
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">Net Income Available for EMI</div>
      <div :class="colcss">
        <q-input
          filled
          outlined
          dense
          disable
          v-model="modalObj.netAvailableIncome"
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
        />
      </div>
    </div>
    <div :class="rowcss">
      <div :class="colcss">Max Loan Amount</div>
      <div :class="colcss">
        <q-input
          filled
          outlined
          dense
          disable
          v-model="modalObj.maxLoanAmount"
        />
      </div>
    </div>
    <div class="row justify-center q-pt-md">
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
const colcss = ref('col-xs-12 col-sm-12 col-md-6');
const rowcss = ref('row q-col-gutter-xs q-pt-sm');
const ExpensesSelected = ref('');
const ExpensesAmount = ref('');
const editExpensesSelected = ref('');
const editExpensesAmount = ref('');
const saveIndex = ref(0);
const editIndex = ref();
const errormsg = ref('');
// const ExpensesArray = ref([]);

const ExpensTotal = ref(0);
const EditCondition = ref(true);

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
  if (ExpensesAmount.value && ExpensesSelected.value) {
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
  } else {
    error.value = true;
  }
};
const Editremove = (index: number) => {
  data.ExpensesArray.splice(index, 1);
  editExpensesSelected.value = '';
  editExpensesAmount.value = '';
  editIndex.value = -1;
  calculateAmount();
  // editIndex.value = null;
};
const remove = (index: number) => {
  const obj = data.ExpensesArray[index];
  const val = parseInt(obj['value'] as keyof typeof number);
  ExpensTotal.value -= val;
  data.ExpensesArray.splice(index, 1);
  editExpensesSelected.value = '';
  editExpensesAmount.value = '';
  editIndex.value = -1;
  calculateAmount();
  // editIndex.value = null;
};
const edit = (index: number) => {
  if (EditCondition.value) {
    const obj = data.ExpensesArray[index];
    const val = parseInt(obj['value'] as keyof typeof number);
    ExpensTotal.value -= val;
    editExpensesSelected.value = obj['field'] as keyof typeof String;
    editExpensesAmount.value = obj['value'] as keyof typeof String;
    saveIndex.value = index;
    editIndex.value = index;
    EditCondition.value = false;

    // data.ExpensesArray.splice(index, 1);
    calculateAmount();
  } else {
    EditCondition.value = true;
    const obj = data.ExpensesArray[saveIndex.value];
    const val = parseInt(obj['value'] as keyof typeof number);
    ExpensTotal.value += val;

    const obj2 = data.ExpensesArray[index];
    const val2 = parseInt(obj2['value'] as keyof typeof number);
    ExpensTotal.value -= val2;
    editExpensesSelected.value = obj2['field'] as keyof typeof String;
    editExpensesAmount.value = obj2['value'] as keyof typeof String;
    saveIndex.value = index;
    editIndex.value = index;
    EditCondition.value = false;
  }
};

const editSave = () => {
  if (parseInt(editExpensesAmount.value) >= 0) {
    const obj = data.ExpensesArray[saveIndex.value];
    obj.value = editExpensesAmount.value;
    data.ExpensesArray.splice(saveIndex.value, 1, obj);
    let num = parseInt(editExpensesAmount.value);
    ExpensTotal.value += num;
    calculateAmount();
    editIndex.value = -1;
    EditCondition.value = true;
  } else {
    errormsg.value = 'required number';
  }
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
.text-label {
  font-size: calc(0.5vw + 8px);
}
</style>
