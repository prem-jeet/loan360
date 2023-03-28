<template>
  <div class="q-mt-sm q-mb-md">
    <p>Expense</p>

    <div class="row q-mt-sm justify-between q-px-lg">
      <div class="col-5">
        <q-select
          outlined
          dense
          v-model="selectedExpense"
          :options="filteredExpenseOptions"
          label="Expenses"
          hide-bottom-space
        />
      </div>
      <div class="col-6">
        <q-input
          outlined
          dense
          v-model.number="expenseAmount"
          hide-bottom-space
          type="number"
          input-class="text-right remove-input-number-indicator"
        />
      </div>
    </div>

    <div class="flex q-mt-md q-px-lg">
      <div class="text-weight-medium" v-if="expenses.length">
        Total expense: {{ totalExpense }}
      </div>

      <q-btn
        size="xs"
        class="q-ml-auto"
        color="light-blue"
        @click="addExpense"
        icon="add"
        padding="sm"
      >
        <q-tooltip> Add Expenses</q-tooltip>
      </q-btn>
      <q-btn
        size="xs"
        class="q-ml-md"
        color="red"
        @click="clearExpense"
        icon="refresh"
        padding="sm"
      >
        <q-tooltip>Clear</q-tooltip>
      </q-btn>
    </div>

    <div
      class="row q-px-lg items-center q-gutter-x-md q-mt-sm"
      v-for="expense in expenses"
      :key="expense.label"
    >
      <div class="col-auto q-gutter-x-sm">
        <q-btn icon="edit" color="purple" size="xs" padding="sm">
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
        <q-btn
          icon="delete"
          color="red"
          size="xs"
          padding="sm"
          @click="() => deleteExpense(expense.label)"
        >
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
      </div>
      <div class="col">{{ expense.label }}</div>
      <div class="col">{{ expense.amount }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import { onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';

const emits = defineEmits(['totalExpense']);

const selectedExpense = ref<string | null>(null);
const expenseAmount = ref<number | null>(null);
const expenseOptions = ref<string[]>([]);
const expenses = ref<{ label: string; amount: number }[]>([]);

const filteredExpenseOptions = computed(() => {
  if (!expenseOptions.value.length) {
    return [];
  }
  const unavailableOptions = expenses.value.map((expense) => expense.label);
  return expenseOptions.value.filter(
    (option) => !unavailableOptions.includes(option)
  );
});

const totalExpense = computed(() => {
  return expenses.value.reduce((acc, val) => acc + val.amount, 0);
});

const addExpense = () => {
  if (
    selectedExpense.value &&
    expenseAmount.value !== null &&
    typeof expenseAmount.value != 'string'
  )
    expenses.value = [
      ...expenses.value,
      {
        label: selectedExpense.value,
        amount: expenseAmount.value,
      },
    ];
  clearExpense();
};

const clearExpense = () => {
  selectedExpense.value = null;
  expenseAmount.value = null;
};

const deleteExpense = (id: string) => {
  expenses.value = expenses.value.filter((expense) => expense.label !== id);
};

onMounted(async () => {
  const rsp = await api.get('expenses');

  if (rsp.data) {
    expenseOptions.value = rsp.data.map((item: { name: string }) => item.name);
  }
});
</script>
<style scoped></style>
