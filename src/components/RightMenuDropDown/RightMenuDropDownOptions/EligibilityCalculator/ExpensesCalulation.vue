<template>
  <div class="q-mt-sm q-mb-md">
    <p>Expense</p>

    <div
      class="row q-mt-sm justify-between q-px-lg"
      v-if="filteredExpenseOptions.length"
    >
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
      <div v-if="filteredExpenseOptions.length" class="q-ml-auto">
        <q-btn
          size="xs"
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
    </div>

    <div
      class="row q-px-lg items-center q-gutter-x-md q-mt-sm"
      v-for="expense in expenses"
      :key="expense.label"
    >
      <div class="col-auto q-gutter-x-sm">
        <q-btn
          outline
          :icon="expense.label !== editingExpenseLabel ? 'edit' : 'check'"
          :color="expense.label !== editingExpenseLabel ? 'purple' : 'green'"
          size="xs"
          padding="sm"
          @click="
            () => {
              if (expense.label !== editingExpenseLabel) {
                editExpense(expense);
              } else {
                saveEditedExpense();
              }
            }
          "
        >
          <q-tooltip>
            {{ expense.label !== editingExpenseLabel ? 'Edit' : 'Save' }}
          </q-tooltip>
        </q-btn>
        <q-btn
          outline
          :icon="expense.label !== editingExpenseLabel ? 'delete' : 'close'"
          color="red"
          size="xs"
          padding="sm"
          @click="
            () => {
              if (expense.label !== editingExpenseLabel) {
                deleteExpense(expense.label);
              } else {
                editingExpenseLabel = null;
                editingExpenseAmount = null;
              }
            }
          "
        >
          <q-tooltip>
            {{ expense.label !== editingExpenseLabel ? 'Delete' : 'Cancel' }}
          </q-tooltip>
        </q-btn>
      </div>
      <div class="col">
        <template
          v-if="
            editingExpenseLabel !== expense.label ||
            filteredEditingExpenseOptions.length < 2
          "
        >
          {{ expense.label }}
        </template>
        <template v-else>
          <q-select
            outlined
            dense
            v-model="editingExpenseLabel"
            :options="filteredEditingExpenseOptions"
            hide-bottom-space
          />
        </template>
      </div>
      <div class="col">
        <template v-if="editingExpenseLabel !== expense.label">
          {{ expense.amount }}
        </template>
        <template v-else> editing </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import { watch, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';

const emits = defineEmits(['totalExpense']);

const selectedExpense = ref<string | null>(null);
const expenseAmount = ref<number | null>(null);
const expenseOptions = ref<string[]>([]);
const expenses = ref<{ label: string; amount: number }[]>([]);

const editingExpenseLabel = ref<string | null>(null);
const editingExpenseAmount = ref<number | null>(null);

const filteredExpenseOptions = computed(() => {
  if (!expenseOptions.value.length) {
    return [];
  }
  const unavailableOptions = expenses.value.map((expense) => expense.label);
  return expenseOptions.value.filter(
    (option) => !unavailableOptions.includes(option)
  );
});
const filteredEditingExpenseOptions = computed(() => [
  ...filteredExpenseOptions.value,
  editingExpenseLabel.value,
]);

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

const editExpense = (expese: { label: string; amount: number }) => {
  editingExpenseLabel.value = expese.label;
  editingExpenseAmount.value = expese.amount;
};

const saveEditedExpense = () => {
  expenses.value = expenses.value.map((expense) => {
    if (expense.label !== editingExpenseLabel.value) {
      return expense;
    }

    return {
      label: editingExpenseLabel.value!,
      amount: editingExpenseAmount.value!,
    };
  });
  editingExpenseLabel.value = null;
  editingExpenseAmount.value = null;
};

onMounted(async () => {
  const rsp = await api.get('expenses');

  if (rsp.data) {
    expenseOptions.value = rsp.data.map((item: { name: string }) => item.name);
  }
});

watch(totalExpense, () => {
  let total = 0;
  if (expenses.value.length) {
    total = totalExpense.value;
  }

  emits('totalExpense', total);
});
</script>
<style scoped></style>
