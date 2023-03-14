<template>
  <div :class="rowCss">
    <div :class="colCssL">
      <q-btn
        color="dark"
        size="xs"
        outline
        dense
        padding="sm sm"
        icon="arrow_back"
        @click="back"
      />
    </div>
    <div :class="colCssL">
      <q-btn color="red-5" label="PDF" size="md" icon="download" />
    </div>
    <div :class="colCssL">
      <q-btn color="green-5" label="Excel" size="md" icon="download" />
    </div>
  </div>
  <div v-if="select === 'IRR'">
    <div class="row justify-between q-pa-sm">
      <div class="col-4">Amount+Intt. {{ irr.agreedAmount }}</div>
      <div v-if="irr.name" class="col-3">Name: {{ irr.name }}</div>
    </div>
    <div v-if="adding">
      <div
        v-if="installmentArray.installmentStructure.length > 0"
        class="row justify-start q-pa-sm"
      >
        <div class="col">
          <b>PDC/ACH : </b> {{ totalInst }} of Rs.{{
            installmentArray.installmentStructure[0].amount
          }}
          each
        </div>
      </div>

      <div
        v-for="(item, index) in installmentArray.installmentStructure"
        :key="index"
        class="row justify-start q-pa-sm"
        style="border: 1px solid rgba(164, 219, 232)"
      >
        <div class="col-8">
          {{ item.no }} Insts. of Rs.{{ item.amount }} each
        </div>
        <div class="col-4 text-right">
          <q-btn
            color="red-7"
            icon="fa-solid fa-xmark"
            size="xs"
            round
            unelevated
            @click="remove(index)"
          >
          </q-btn>
        </div>
      </div>
      <div class="row justify-start q-pa-sm">
        <div class="col-8 q-pt-sm">
          Total {{ totalInst }} Insts of Rs.{{ totalAmt }}
        </div>
        <div class="col-4 text-right">
          <q-btn color="blue" @click="adding = !adding">add</q-btn>
        </div>
      </div>
    </div>
    <div v-else>
      <div :class="rowCss" class="q-px-sm">
        <div :class="colCssLL">Number</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="addInstallment.no"
            hide-bottom-space
            type="number"
            placeholder="No. of Inst "
            input-class="remove-input-number-indicator"
          />
        </div>
        <div :class="colCssLL">% age</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="addInstallment.percent"
            hide-bottom-space
            type="number"
            placeholder="%age of Agreed amount"
            input-class="remove-input-number-indicator"
            @update:model-value="calcAmount()"
          />
        </div>
      </div>
      <div :class="rowCss" class="q-pa-sm">
        <div :class="colCssLL">Amount</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="addInstallment.amount"
            hide-bottom-space
            type="number"
            placeholder="Amt. of Inst."
            input-class="remove-input-number-indicator"
          />
        </div>
        <div :class="colCssLL"></div>
        <div
          :class="colCssR"
          class="text-right q-mt-xs-none q-mt-sm-sm q-mt-md-sm"
        >
          <q-btn
            icon="fa-solid fa-check"
            color="blue"
            size="sm"
            class="q-mr-sm"
            @click="addInst()"
          ></q-btn>
          <q-btn
            icon="fa-solid fa-xmark"
            color="red"
            size="sm"
            @click="adding = !adding"
          ></q-btn>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div
      v-if="installmentArray.installmentStructure.length > 0"
      class="row justify-start q-pa-sm"
    >
      <div class="col">
        <b>PDC/ACH : </b> {{ totalInst }} of Rs.{{
          installmentArray.installmentStructure[0].amount
        }}
        each
      </div>
    </div>
    <div
      v-for="item in installmentArray.installmentStructure"
      :key="item as number"
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
    <div v-if="select === 'IRR'" class="col-xs-12 col-sm-6 col-md-8">
      <q-btn
        color="light-blue"
        label="calculate irr"
        @click="calcIRR()"
      ></q-btn>
      <span class="q-ma-sm text-bold">IRR : {{ irr.irr }}</span>
    </div>
    <div v-else class="col-xs-12 col-sm-6 col-md-8"></div>
    <div class="col-xs-12 col-sm-6 col-md-4 text-right">
      <q-btn color="light-blue" label="reset" @click="reset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { IrrObject, installmentData, addInstallment } from './types';
const rowCss =
  'row q-col-gutter-md-md q-col-gutter-sm-sm q-col-gutter-xs-sm justify-center';
const colCssLL =
  'col-12 col-xs-12 col-sm-6 col-md-2 q-mt-xs-sm q-mt-sm-none q-mt-md-sm';
const colCssL = 'col-12 col-xs-4 col-sm-4 col-md-4';
const colCssR = 'col-12 col-xs-12 col-sm-6 col-md-4';
const emits = defineEmits(['back', 'reset']);
let entries: any[] = [];
const totalInst = ref(0);
const totalAmt = ref(0);
const adding = ref(true);
const installmentArray = reactive<installmentData>({
  installmentStructure: [],
});
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
const addInstallment = reactive<addInstallment>({});

const back = () => {
  emits('back');
};
const reset = () => {
  emits('reset');
};
const addInst = () => {
  installmentArray.installmentStructure.push(addInstallment);
  calcTotals();
  adding.value = true;
};
const remove = (index: number) => {
  installmentArray.installmentStructure.splice(index, 1);
};
const calcInterest = () => {
  if (irr.amount && irr.rate && irr.inttMonths) {
    irr.interest = ((irr.amount * irr.rate) / 100 / 12) * irr.inttMonths;
    irr.agreedAmount = irr.amount + irr.interest;
  }
};
const calcAmount = () => {
  addInstallment.amount = Math.round(
    ((irr.agreedAmount as number) * (addInstallment.percent as number)) /
      100 /
      (addInstallment.no as number)
  );
};
const calcIntallments = () => {
  if (installmentArray.installmentStructure.length > 0) {
    return;
  }
  installmentArray.installmentStructure = [];
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
  installmentArray.installmentStructure = [];
  installmentArray.installmentStructure.push(inst1);
  installmentArray.installmentStructure.push(inst2);
  calcTotals();
};

const makeEntries = () => {
  let dt = new Date();
  let ent = {
    dt: dt,
    ino: 0,
    amount:
      (irr.amount as number) -
      (irr.charges || 0) +
      (irr.commission || 0) -
      (irr.security || 0),
  };
  entries = [];
  entries.push(ent);

  let advanceLeft = irr.advInstallments || 0;
  let ino = 1;
  for (let i = 0; i < installmentArray.installmentStructure.length; i++) {
    for (
      let j = 1;
      j <= (installmentArray.installmentStructure[i].no as number);
      j++
    ) {
      // ent = {};
      // ent.dt = new Date(dt.getTime());
      if (advanceLeft > 0) {
        --advanceLeft;
        entries[0].amount -= installmentArray.installmentStructure[i]
          .amount as number;
      } else {
        dt = new Date();
        dt.setMonth(dt.getMonth() + ino);
        let ent2 = {
          dt: dt,
          ino: ino,
          amount: -(installmentArray.installmentStructure[i].amount as number),
        };

        entries.push(ent2);
      }
      ino++;
    }
  }

  entries[entries.length - 1].amount += irr.security || 0;
  if ((irr.rebate as number) > 0) {
    let rebateBalance = irr.rebate;
    let j = entries.length - 1;
    for (let i = j; i >= 0; i--) {
      if (-entries[i].amount >= (rebateBalance as number)) {
        entries[i].amount += rebateBalance;
        break;
      } else {
        (rebateBalance as number) -= entries[i].amount;
        entries.splice(i, 1);
      }
    }
  }
};

const calcIRR = () => {
  makeEntries();
  let _p = 0;
  let Intt = 0;
  let Irr_ = 0;
  let FstDt;
  let lldt;
  let chkdt;
  let nCount;
  let u = 1.990008372;
  let l = 0.0000000000001;
  let times = 0;
  let lldays = 0;
  while (times < 1000) {
    times = times + 1;
    _p = 0;
    Intt = 0;
    Irr_ = (u + l) / 2;
    FstDt = entries[0].dt;
    lldt = FstDt;
    nCount = 1;
    for (let i = 0; i < entries.length; i++) {
      lldays = 365 / 12;
      Intt = Intt + (_p * lldays * Irr_) / 100;
      chkdt = FstDt;
      chkdt.setMonth(chkdt.getMonth(), nCount);
      _p = _p + Intt;
      Intt = 0;
      nCount = nCount + 1;
      _p = _p + entries[i].amount;
      lldt = entries[i].dt;
    }
    if (_p < 0) {
      l = Irr_;
    } else {
      u = Irr_;
    }
  }
  irr.irr = Math.round(Irr_ * 365 * 1000) / 1000;
};

const calcTotals = () => {
  let ti = 0,
    ta = 0;

  for (let i = 0; i < installmentArray.installmentStructure.length; i++) {
    ti = ti + (installmentArray.installmentStructure[i].no as number);
    ta =
      ta +
      (installmentArray.installmentStructure[i].amount as number) *
        (installmentArray.installmentStructure[i].no as number);
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
  installmentArray.installmentStructure = [];
  const inst1 = {
    no: (irr.installments as number) - 1,
    amount: Math.ceil(inst),
  };
  installmentArray.installmentStructure.push(inst1);
  const inst2 = {
    no: 1,
    amount: Math.ceil(
      (irr.installments as number) * inst -
        ((irr.installments as number) - 1) * Math.ceil(inst)
    ),
  };
  installmentArray.installmentStructure.push(inst2);
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
