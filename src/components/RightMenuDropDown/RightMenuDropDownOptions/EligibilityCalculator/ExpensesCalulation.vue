<template>
  <div class="row q-col-gutter-xs q-pb-sm">
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
        mask="#################"
        ref="inputRef"
        :error="error && !ExpensesAmount"
        error-message=""
        input-class="text-right"
      />
    </div>
  </div>

  <div class="row q-col-gutter-xs q-pt-sm justify-end q-pr-lg">
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
      ><q-tooltip>clear</q-tooltip></q-btn
    >
  </div>

  <div
    class="row q-pt-xs q-mx-lg-lg q-col-gutter-sm"
    v-for="(item, index) in data.ExpensesArray"
    :key="index"
  >
    <div v-if="editIndex !== index" class="col-4 col-md-4">
      {{ item.field }}
    </div>
    <div v-else class="col-4 col-md-5">
      <q-select
        outlined
        dense
        ref="inputRef"
        :error="errormsg && !editExpensesSelected"
        error-message=""
        v-model="editExpensesSelected"
        :options="Expenses"
      ></q-select>
    </div>
    <div v-if="editIndex !== index" class="col-3 col-md-4 text-right">
      {{ item.value }}
    </div>
    <div v-else class="col-3 col-md-4 text-right">
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
        size="xs"
        color="blue"
        @click="edit(index)"
        icon="fa-solid fa-pen-to-square"
      >
        <q-tooltip> Edit </q-tooltip>
      </q-btn>
      &nbsp;
      <q-btn
        size="xs"
        color="red"
        @click="remove(index)"
        icon="fa-solid fa-xmark"
        ><q-tooltip> Delete</q-tooltip>
      </q-btn>
    </div>
    <div v-else class="col-5 col-md-3 q-pt-md text-center">
      <q-btn size="xs" color="blue" @click="editSave()" icon="fa-solid fa-check"
        ><q-tooltip> save</q-tooltip>
      </q-btn>
      &nbsp;
      <q-btn
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
    class="row q-pt-xs q-mx-lg-lg q-col-gutter-sm"
  >
    <div class="col-4 col-md-4">Total Expenses</div>
    <div class="col-4 col-md-4 text-right">{{ ExpensTotal }}</div>
    <div class="col-4 col-md-4"></div>
  </div>
</template>
<script setup lang="ts">
import { number } from '@intlify/core-base';
import { ref, reactive } from 'vue';
const error = ref(false);
const colcss = ref('col-xs-12 col-sm-12 col-md-6');
const ExpensesSelected = ref('');
const ExpensesAmount = ref('');
const editExpensesSelected = ref('');
const editExpensesAmount = ref('');
const saveIndex = ref(0);
const editIndex = ref();
const EditCondition = ref(true);
const errormsg = ref(false);
const ExpensTotal = ref(0);
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
const Editremove = (index: number) => {
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
    errormsg.value = true;
  }
};

const refresh = () => {
  (ExpensesSelected.value = ''), (ExpensesAmount.value = '');
};

const emits = defineEmits(['updateToatal']);
const calculateAmount = () => {
  emits('updateToatal', ExpensTotal.value);
};
</script>
<style scoped>
.q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
