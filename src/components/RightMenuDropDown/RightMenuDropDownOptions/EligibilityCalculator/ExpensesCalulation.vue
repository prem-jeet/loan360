<template>
  <div class="row q-col-gutter-xs q-pb-sm q-pt-sm">
    <div :class="colcss">Expenses</div>
  </div>

  <div class="row q-col-gutter-xs q-pb-xs">
    <div :class="colcss">
      <q-select
        outlined
        dense
        ref="inputRef"
        :error="error && !expensesSelected"
        error-message=""
        v-model="expensesSelected"
        :options="expenses"
        label="Expenses"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <q-input
        outlined
        dense
        v-model="expensesAmount"
        mask="#################"
        ref="inputRef"
        :error="error && !expensesAmount"
        error-message=""
        input-class="text-right"
      />
    </div>
  </div>

  <div class="row q-col-gutter-xs q-pt-sm justify-end q-pr-md-lg q-pr-xs-none">
    <q-btn
      size="sm"
      class="q-pl-md q-mr-sm"
      color="light-blue"
      @click="add()"
      icon="fa-solid fa-plus"
    >
      <q-tooltip> Add Expenses</q-tooltip>
    </q-btn>
    <q-btn
      size="sm"
      class="q-pl-md"
      color="light-blue"
      @click="refresh()"
      icon="fa-solid fa-arrow-rotate-left"
      ><q-tooltip>clear</q-tooltip>
    </q-btn>
  </div>

  <div
    class="row q-mx-lg-lg q-col-gutter-sm q-pt-xs-md q-pt-sm-xs q-pt-md-xs"
    v-for="(item, index) in data.ExpensesArray"
    :key="index"
  >
    <div v-if="editIndex !== index" class="col-4 col-md-4">
      {{ item.field }}
    </div>
    <div v-else class="col-xs-12 col-sm-12 col-md-5">
      <q-select
        outlined
        dense
        ref="inputRef"
        :error="errormsg && !editExpensesSelected"
        error-message=""
        v-model="editExpensesSelected"
        :options="expenses"
      >
      </q-select>
    </div>
    <div v-if="editIndex !== index" class="col-3 col-md-4 text-right">
      {{ item.value }}
    </div>
    <div v-else class="col-xs-12 col-sm-12 col-md-4 text-right">
      <q-input
        :error="errormsg && !editExpensesAmount"
        error-message=""
        outlined
        dense
        v-model="editExpensesAmount"
        mask="#################"
        input-class="text-right"
      ></q-input>
    </div>
    <div v-if="editIndex !== index" class="col-5 col-md-4 text-right">
      <q-btn
        class="q-mr-sm"
        size="xs"
        color="blue"
        @click="edit(index)"
        icon="fa-solid fa-pen-to-square"
      >
        <q-tooltip> Edit </q-tooltip>
      </q-btn>
      <q-btn
        size="xs"
        color="red"
        @click="remove(index)"
        icon="fa-solid fa-xmark"
        ><q-tooltip> Delete</q-tooltip>
      </q-btn>
    </div>
    <div v-else class="col-xs-12 col-sm-12 col-md-3 text-right">
      <q-btn
        size="xs"
        color="blue"
        @click="editSave()"
        icon="fa-solid fa-check"
      >
        <q-tooltip> save</q-tooltip>
      </q-btn>
      <q-btn
        class="q-ml-sm"
        size="xs"
        color="red"
        @click="Editremove(index)"
        icon="fa-solid fa-xmark"
        ><q-tooltip> Delete</q-tooltip>
      </q-btn>
    </div>
  </div>
  <div
    v-if="data.ExpensesArray.length > 0"
    class="row q-pt-md q-mx-lg-lg q-col-gutter-sm"
  >
    <div class="col-4 col-md-4 col-xs-4 col-sm-4 text-bold">Total Expenses</div>
    <div
      class="col-4 col-md-4 col-xs-4 col-sm-3 text-right q-pr-xs-lg q-pr-sm-none q-pr-md-none"
    >
      {{ expensTotal }}
    </div>
    <div class="col-4 col-md-4 col-xs-4 col-sm-5"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ExpensesData } from './type';

const error = ref(false);
const colcss = 'col-xs-12 col-sm-12 col-md-6';
const expensesSelected = ref('');
const expensesAmount = ref('');
const editExpensesSelected = ref('');
const editExpensesAmount = ref('');
const saveIndex = ref(0);
const editIndex = ref();
const editCondition = ref(true);
const errormsg = ref(false);
const expensTotal = ref(0);
const expenses = ref([
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

const data = reactive<ExpensesData>({
  ExpensesArray: [],
});

const add = () => {
  if (expensesAmount.value && expensesSelected.value) {
    data.ExpensesArray.push({
      field: expensesSelected.value,
      value: parseInt(expensesAmount.value),
    });
    let num = parseInt(expensesAmount.value);
    expensTotal.value += num;
    expensesSelected.value = '';
    expensesAmount.value = '';
    calculateAmount();
    error.value = false;
  } else {
    error.value = true;
  }
};
const remove = (index: number) => {
  const obj = data.ExpensesArray[index];
  const val = obj.value;
  expensTotal.value -= val as number;
  data.ExpensesArray.splice(index, 1);
  editExpensesSelected.value = '';
  editExpensesAmount.value = '';
  editIndex.value = -1;
  calculateAmount();
  // editIndex.value = null;
};
const Editremove = (index: number) => {
  data.ExpensesArray.splice(index, 1);
  editExpensesSelected.value = '';
  editExpensesAmount.value = '';
  editIndex.value = -1;
  calculateAmount();
  // editIndex.value = null;
};
const edit = (index: number) => {
  if (editCondition.value) {
    const obj = data.ExpensesArray[index];
    const val = obj.value;
    expensTotal.value -= val as number;
    editExpensesSelected.value = obj.field as string;
    editExpensesAmount.value = (obj.value as number).toString();
    saveIndex.value = index;
    editIndex.value = index;
    editCondition.value = false;
    // data.ExpensesArray.splice(index, 1);
    calculateAmount();
  } else {
    editCondition.value = true;
    const obj = data.ExpensesArray[saveIndex.value];
    const val = obj.value;
    expensTotal.value += val as number;

    const obj2 = data.ExpensesArray[index];
    const val2 = obj2.value;
    expensTotal.value -= val2 as number;
    editExpensesSelected.value = obj2.field as string;
    editExpensesAmount.value = (obj2.value as number).toString();
    saveIndex.value = index;
    editIndex.value = index;
    editCondition.value = false;
    calculateAmount();
  }
};

const editSave = () => {
  if (parseInt(editExpensesAmount.value) >= 0) {
    const obj = data.ExpensesArray[saveIndex.value];
    obj.value = parseInt(editExpensesAmount.value);
    data.ExpensesArray.splice(saveIndex.value, 1, obj);
    let num = parseInt(editExpensesAmount.value);
    expensTotal.value += num;
    calculateAmount();
    editIndex.value = -1;
    editCondition.value = true;
  } else {
    errormsg.value = true;
  }
};

const refresh = () => {
  (expensesSelected.value = ''), (expensesAmount.value = '');
};

const emits = defineEmits(['updateToatal']);
const calculateAmount = () => {
  emits('updateToatal', expensTotal.value);
};
</script>
<style scoped>
.q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
