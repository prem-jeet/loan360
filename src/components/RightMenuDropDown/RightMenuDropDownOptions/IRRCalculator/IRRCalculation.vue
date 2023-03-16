<template>
  <div :class="rowCss" class="q-mb-sm">
    <div class="col-xs-6 col-sm-6 col-md-6">
      <q-btn color="dark" size="sm" outline icon="arrow_back" @click="back">
        <q-tooltip> back </q-tooltip>
      </q-btn>
    </div>

    <div class="col-xs-6 col-sm-6 col-md-6 text-right">
      <q-btn-dropdown color="primary" label="Download">
        <q-list>
          <q-item clickable v-close-popup @click="download('pdf')">
            <q-item-section avatar>
              <q-avatar
                icon="download"
                size="sm"
                color="red-5"
                text-color="white"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label icon="download">PDF</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="download('excel')">
            <q-item-section avatar>
              <q-avatar
                icon="download"
                size="sm"
                color="green-5"
                text-color="white"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label icon="download">Excel</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
  <div v-if="select === 'IRR'">
    <div v-if="irr.name" class="row justify-between q-pa-xs q-mt-sm">
      <div class="col"><b> Name:</b> {{ irr.name }}</div>
    </div>
    <div class="row justify-between q-pa-xs">
      <div class="col">Amount+Intt. {{ irr.agreedAmount }}</div>
    </div>
    <div v-if="adding">
      <div
        v-if="installmentArray.installmentStructure.length > 0"
        class="row justify-start q-pa-xs"
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
          <q-btn color="green-8" @click="adding = !adding">add</q-btn>
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
            :error="error && !addInstallment.no"
            error-message=""
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
            :error="error && !addInstallment.percent"
            error-message=""
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
            :error="error && !addInstallment.amount"
            error-message=""
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
  <div class="row q-mt-sm">
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
      <q-btn color="red-8" label="reset" @click="reset" />
    </div>
  </div>
  <div v-show="false" id="pdf-window">
    <div><p style="color: #336b6b">Company Name : IKF Finance Limited</p></div>
    <div v-if="irr.name">
      <p style="color: #336b6b">Name : {{ irr.name }}</p>
    </div>
    <q-table
      :rows="irrInstItemsEmi"
      :columns="columns"
      v-model:pagination="pagination"
      row-key="name"
      hide-bottom
      separator="cell"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="
              border-style: solid;
              padding: 5px 5px;
              border-color: lightgreen;
              text-align: center;
            "
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.key"
            :props="col.props"
            style="
              border-style: solid;
              padding: 5px 5px;
              border-color: lightgreen;
              text-align: center;
              width: 80px;
            "
          >
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
      <template v-slot:bottom-row>
        <q-tr>
          <q-td
            v-for="col in columns"
            :key="col.name"
            style="
              border-style: solid;
              padding: 5px 5px;
              border-color: lightgreen;
              text-align: center;
            "
          >
            {{ totalColumn(col.name) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { IrrObject, InstallmentData, AddInstallment, DataItem } from './types';
import { downloadAsPDF } from 'src/utils/download';
import { api } from 'src/boot/axios';

const props = defineProps({
  data: {
    type: Object,
  },
  select: {
    type: String,
    required: true,
  },
});

const rowCss =
  'row q-col-gutter-md-md q-col-gutter-sm-sm q-col-gutter-xs-sm justify-center';
const colCssLL =
  'col-12 col-xs-12 col-sm-6 col-md-2 q-mt-xs-sm q-mt-sm-none q-mt-md-sm';
const colCssR = 'col-12 col-xs-12 col-sm-6 col-md-4';
const emits = defineEmits(['back', 'reset']);
let entries: any[] = [];
let irrInstItems: any[] = [];
const totalInst = ref(0);
const totalAmt = ref(0);
const error = ref(false);
const adding = ref(true);
const pagination = ref({ rowsPerPage: 20 });
const installmentArray = reactive<InstallmentData>({
  installmentStructure: [],
});
const irr = reactive<IrrObject>({ ...props.data });
const addInstallment = reactive<AddInstallment>({});
const irrInstItemsEmi = ref<DataItem[]>([]);
const columns: {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align: 'center';
  sortable?: boolean;
}[] = [
  {
    name: 'sno',
    required: true,
    label: 'No',
    align: 'center',
    field: 'sno',
    sortable: true,
  },
  {
    name: 'nextEmi',
    label: 'EMI Date',
    field: 'nextEmi',
    align: 'center',
    sortable: true,
  },
  {
    name: 'instalment',
    label: 'Instalment',
    field: 'instalment',
    align: 'center',
    sortable: true,
  },
  { name: 'interest', label: 'Interest', field: 'interest', align: 'center' },
  {
    name: 'principleReceived',
    label: 'PrincipleReceived',
    field: 'principleReceived',
    align: 'center',
  },
  {
    name: 'principleOs',
    label: 'PrincipleOs',
    field: 'principleOs',
    align: 'center',
  },
  {
    name: 'interestOs',
    label: 'InterestOs',
    field: 'interestOs',
    align: 'center',
  },
];
const totalColumn = (val: string) => {
  let total = 0;
  if (val === 'nextEmi') {
    return 'Total';
  } else if (val === 'instalment') {
    for (let i = 0; i < irrInstItemsEmi.value.length; i++) {
      total += irrInstItemsEmi.value[i].instalment as number;
    }
    return total;
  } else if (val === 'interest') {
    for (let i = 0; i < irrInstItemsEmi.value.length; i++) {
      total += irrInstItemsEmi.value[i].interest as number;
    }
    return total;
  } else if (val === 'principleReceived') {
    for (let i = 0; i < irrInstItemsEmi.value.length; i++) {
      total += irrInstItemsEmi.value[i].principleReceived as number;
    }
    return total;
  } else {
    return;
  }
};
const back = () => {
  emits('back');
};
const reset = () => {
  emits('reset');
};
const addInst = () => {
  if (!(addInstallment.amount && addInstallment.percent && addInstallment.no)) {
    error.value = true;
  } else {
    installmentArray.installmentStructure.push(addInstallment);
    calcTotals();
    adding.value = true;
  }
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

const download = async (type: string) => {
  irrInstItems = [];
  let PrinciplieReceived;
  let Balance = irr.amount;
  let interest;
  let sumOfInterest = 0;
  let sumOfprincipleReceived = 0;
  let nextEmi;
  const firstEmi = irr.firstEmi;
  let incrementCount = 0;
  let today = new Date(Date.parse(irr.firstEmi as string));
  for (let i = 0; i < (irr.installments as number); i++) {
    if (i == 0) {
      nextEmi = firstEmi;
    } else {
      if (i == 1) {
        nextEmi = irr.nextEmi;
      } else {
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const days = ['29', '30', '31'];

        if (month === '01' && days.includes(day)) {
          const year = today.getFullYear().toString();
          const checkYear = parseInt(year);
          if (
            (checkYear % 4 === 0 && checkYear % 100 !== 0) ||
            checkYear % 400 === 0
          ) {
            const day = '29';
            const month = (today.getMonth() + 2).toString().padStart(2, '0');
            nextEmi = `${year}-${month}-${day}`;
            today = new Date(Date.parse(nextEmi));
          } else {
            const day = '28';
            const month = (today.getMonth() + 2).toString().padStart(2, '0');
            nextEmi = `${year}-${month}-${day}`;
            today = new Date(Date.parse(nextEmi));
          }
        } else if (month === '12' && day === '31') {
          const day = today.getDate().toString().padStart(2, '0');
          const month = '01';
          const year = (today.getFullYear() + 1).toString();
          nextEmi = `${year}-${month}-${day}`;
          today = new Date(Date.parse(nextEmi));
        } else if (month === '12') {
          const day = today.getDate().toString().padStart(2, '0');
          const month = '01';
          const year = (today.getFullYear() + 1).toString();
          nextEmi = `${year}-${month}-${day}`;
          today = new Date(Date.parse(nextEmi));
        } else if (day === '31') {
          const day = (today.getDate() - 1).toString().padStart(2, '0');
          const month = (today.getMonth() + 2).toString().padStart(2, '0');
          const year = today.getFullYear().toString();
          nextEmi = `${year}-${month}-${day}`;
          today = new Date(Date.parse(nextEmi));
        } else {
          const day = today.getDate().toString().padStart(2, '0');
          const month = (today.getMonth() + 2).toString().padStart(2, '0');
          const year = today.getFullYear().toString();
          nextEmi = `${year}-${month}-${day}`;
          today = new Date(Date.parse(nextEmi));
        }
      }
    }

    interest = Math.ceil(((Balance as number) * (irr.irr as number)) / 1200);
    if (i == (irr.installments as number) - 1) {
      PrinciplieReceived =
        (installmentArray.installmentStructure[1].amount as number) - interest;
      Balance = (Balance as number) - PrinciplieReceived;
    } else {
      PrinciplieReceived =
        (installmentArray.installmentStructure[0].amount as number) - interest;
      Balance = (Balance as number) - PrinciplieReceived;
    }
    let testObj = {
      sno: i + 1,
      balance: Balance,
      nextEmi: nextEmi,
      interest: 0,
      principleReceived: 0,
      instalment: 0,
      principleOs: 0,
      interestOs: 0,
    };

    if (i == (irr.installments as number) - 1) {
      testObj.interest = (irr.interest as number) - sumOfInterest;
      testObj.principleReceived =
        (irr.amount as number) - sumOfprincipleReceived;

      testObj.instalment = installmentArray.installmentStructure[1]
        .amount as number;
      testObj.principleOs =
        (irr.amount as number) -
        (sumOfprincipleReceived + testObj.principleReceived);
      testObj.interestOs =
        (irr.interest as number) - (sumOfInterest + testObj.interest);
    } else {
      testObj.interest = interest;
      testObj.principleReceived = PrinciplieReceived;

      testObj.instalment = installmentArray.installmentStructure[0]
        .amount as number;
      sumOfInterest += interest;
      sumOfprincipleReceived += PrinciplieReceived;
      testObj.principleOs = (irr.amount as number) - sumOfprincipleReceived;
      testObj.interestOs = (irr.interest as number) - sumOfInterest;
    }
    irrInstItems.push(testObj);
    // console.log('irrInstItem', irrInstItems);
    irrInstItemsEmi.value = irrInstItems;

    incrementCount = incrementCount + 1;
  }

  if (type === 'pdf') {
    const pdfTemplate = document.getElementById('pdf-window');
    console.log(pdfTemplate);
    downloadAsPDF(pdfTemplate?.innerHTML);

    // setTimeout(() => {
    //   pdfTemplate.value = document.getElementById('pdf-window');
    //   const myWindow = window.open('', '', 'width=1000,height=700');
    //   const templateContent = pdfTemplate.value.innerHTML;
    //   myWindow?.document.write(templateContent);
    //   myWindow?.document.close();
    //   myWindow?.focus();
    //   myWindow?.print();
    //   myWindow?.close();
    // }, 500);
  } else if (type === 'excel') {
    let params = {
      name: irr.name ? irr.name : null,
      company: 'aaa',
      instalments: irrInstItems,
    };
    const rsp = await api.post('irrCalcDownloadExcel', params);
    if (rsp.data && rsp.data.code) {
      console.log('hi');
      let link = document.createElement('a');
      link.download = rsp.data.code;
      link.href = 'Reports/' + rsp.data.code;
      link.click();
    }
  }
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
