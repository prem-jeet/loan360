<template>
  <div :class="rowCss">
    <div :class="colCssL">
      <q-btn color="light-blue" label="back" @click="back" />
    </div>
    <div :class="colCssL">
      <q-btn color="light-blue" label="download PDF" />
    </div>
    <div :class="colCssL">
      <q-btn color="light-blue" label="download excel" />
    </div>
  </div>
  <div v-if="select === 'IRR'">
    <div class="row justify-start q-pa-sm">
      <div class="col">Amount+Intt. {{ irr.agreedAmount }}</div>
    </div>
    <div
      v-if="installmentStructure.length > 0"
      class="row justify-start q-pa-sm"
    >
      <div class="col">
        <b>PDC/ACH : </b> {{ totalInst }} of Rs.{{
          installmentStructure[0].amount
        }}
        each
      </div>
    </div>
    <div
      v-for="item in installmentStructure"
      :key="item"
      class="row justify-start q-pa-sm"
      style="border: 1px solid rgba(164, 219, 232)"
    >
      <div class="col">{{ item.no }} Insts. of Rs.{{ item.amount }} each</div>
    </div>
    <div class="row justify-start q-pa-sm">
      <div class="col">Total {{ totalInst }} Insts of Rs.{{ totalAmt }}</div>
    </div>
  </div>
  <div v-else>
    <div
      v-if="installmentStructure.length > 0"
      class="row justify-start q-pa-sm"
    >
      <div class="col">
        <b>PDC/ACH : </b> {{ totalInst }} of Rs.{{
          installmentStructure[0].amount
        }}
        each
      </div>
    </div>
    <div
      v-for="item in installmentStructure"
      :key="item"
      class="row justify-start q-pa-sm"
      style="border: 1px solid rgba(164, 219, 232)"
    >
      <div class="col">{{ item.no }} Insts. of Rs.{{ item.amount }} each</div>
    </div>
    <div class="row justify-start q-pa-sm">
      <div class="col">Total {{ totalInst }} Insts of Rs.{{ totalAmt }}</div>
    </div>
    <div class="row justify-start q-pa-sm">
      <div class="col">
        Interest {{ irr.interest }} Amount+Intt.{{ irr.agreedAmount }} Rate %
        {{ irr.rate }}
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col text-right">
      <q-btn color="light-blue" label="reset" @click="reset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { IrrObject } from './types';
const rowCss =
  'row q-col-gutter-md-md q-col-gutter-sm-sm q-col-gutter-xs-sm justify-center';
const colCssL = 'col-12 col-xs-4 col-sm-4 col-md-4';
const emits = defineEmits(['back', 'reset']);
let installmentStructure: any[] = [];
let entries: any[] = [];
const totalInst = ref(0);
const totalAmt = ref(0);

const props = defineProps({
  data: {
    type: Object,
  },
  select: {
    type: String,
    required: true,
  },
});
const irr = reactive<IrrObject>({ ...props.data });

const back = () => {
  emits('back');
};
const reset = () => {
  emits('reset');
};

const calcInterest = () => {
  if (irr.amount && irr.rate && irr.inttMonths) {
    irr.interest = ((irr.amount * irr.rate) / 100 / 12) * irr.inttMonths;
    irr.agreedAmount = irr.amount + irr.interest;
  }
};

const calcIntallments = () => {
  if (installmentStructure.length > 0) {
    return;
  }
  installmentStructure = [];
  let inst1 = {
    no: (irr.installments as number) - 1,
    amount: Math.ceil(
      (irr.agreedAmount as number) / (irr.installments as number)
    ),
  };
  let inst2 = {
    no: 1,
    amount: Math.ceil((irr.agreedAmount as number) - inst1.amount * inst1.no),
  };
  installmentStructure = [];
  installmentStructure.push(inst1);
  installmentStructure.push(inst2);
  console.log('hi', installmentStructure);
  calcTotals();
};

const makeEntries = () => {
  let dt = new Date(2000, 0, 1);
  let ent = {};
  entries = [];
};

const calcIRR = () => {
  makeEntries();
};

const calcTotals = () => {
  let ti = 0,
    ta = 0;

  for (let i = 0; i < installmentStructure.length; i++) {
    console.log(
      'hi',
      installmentStructure[i].amount,
      installmentStructure[i].no
    );
    ti = ti + installmentStructure[i].no;
    ta = ta + installmentStructure[i].amount * installmentStructure[i].no;
  }
  totalInst.value = ti;
  totalAmt.value = ta;
  if (props.select == 'IRR') {
    irr.irr = NaN;
  } else {
    irr.rate = NaN;
  }
};

const calcRate = () => {
  const f3 = irr.amount;
  const e3 = (irr.irr as number) / 1200;
  const pd = irr.installments;

  const inst =
    ((((f3 as number) * (e3 * Math.pow(1 + e3, pd as number))) /
      (Math.pow(1 + e3, pd as number) - 1)) *
      100) /
    100;
  installmentStructure = [];
  const inst1 = {
    no: (irr.installments as number) - 1,
    amount: Math.ceil(inst),
  };
  installmentStructure.push(inst1);
  const inst2 = {
    no: 1,
    amount: Math.ceil(
      (irr.installments as number) * inst -
        ((irr.installments as number) - 1) * Math.ceil(inst)
    ),
  };
  installmentStructure.push(inst2);
  calcTotals();
  irr.agreedAmount = Math.round((irr.installments as number) * inst);
  irr.interest = Math.round(
    Math.round((irr.agreedAmount - (irr.amount as number)) * 100) / 100
  );
  irr.rate =
    Math.round(
      (((irr.interest / (irr.amount as number)) * 100 * 12) /
        (irr.installments as number)) *
        100
    ) / 100;
};
onMounted(() => {
  if (props.select === 'IRR') {
    calcInterest();
    calcIntallments();
    calcIRR();
  } else {
    calcRate();
  }
});
</script>

<style scoped></style>
