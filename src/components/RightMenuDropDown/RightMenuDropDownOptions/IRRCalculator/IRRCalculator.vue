<template>
  <q-card class="e-card" flat bordered style="width: 700px; max-width: 80vw">
    <q-item class="bg-light-blue-5 text-white q-pa-none q-ma-none">
      <q-item-section>
        <q-toolbar class="bg-purple-6">
          <p class="q-pt-md">IRR Calculator</p>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-item-section>
    </q-item>
    <q-card-section v-if="next" class="scroll">
      <div class="row justify-center q-mb-sm">
        <div class="col-xs-3 col-sm-4 col-md-4">
          <q-radio v-model="mode" dense val="IRR" label="IRR" />
        </div>
        <div class="col-xs-5 col-sm-4 col-md-4">
          <q-radio v-model="mode" dense val="ReverseIRR" label="Reverse IRR" />
        </div>
        <div v-if="irr.name" class="col-xs-4 col-sm-4 col-md-4">
          Name:{{ irr.name }}
        </div>
      </div>
      <div :class="rowCss">
        <div :class="colCssL">
          Amount
          <span class="text-red">*</span>
        </div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.amount"
            hide-bottom-space
            type="number"
            :error="error && !irr.amount"
            error-message=""
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div v-if="mode == 'IRR'" :class="colCssL">
          Rate <span class="text-red">*</span>
        </div>
        <div v-else :class="colCssL">IRR <span class="text-red">*</span></div>
        <div v-if="mode == 'IRR'" :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.rate"
            hide-bottom-space
            type="number"
            :error="error && !irr.rate"
            error-message=""
            input-class="text-right remove-input-number-indicator"
          />
        </div>

        <div v-else :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.irr"
            hide-bottom-space
            type="number"
            :error="error && !irr.irr"
            error-message=""
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">
          Intt.for Mnths
          <span class="text-red">*</span>
        </div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.inttMonths"
            hide-bottom-space
            type="number"
            :error="error && !irr.inttMonths"
            error-message=""
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">Installments <span class="text-red">*</span></div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.installments"
            hide-bottom-space
            type="number"
            :error="error && !irr.installments"
            error-message=""
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">Name</div>
        <div :class="colCssR">
          <q-input outlined dense v-model="irr.name" />
        </div>
        <div :class="colCssL">1st EMI Date</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="irr.firstEmi"
            type="date"
            @update:model-value="nextEmi"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">2nd EMI Date</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            :disable="nextEmiDisable"
            :filled="nextEmiDisable"
            v-model="irr.nextEmi"
            type="date"
          />
        </div>
        <div v-if="mode === 'IRR'" :class="colCssL">Advance EMIs</div>
        <div v-else :class="colCssL"></div>
        <div v-if="mode === 'IRR'" :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.advInstallments"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div v-else :class="colCssR"></div>
      </div>

      <div v-if="mode == 'IRR'" :class="rowCss">
        <div :class="colCssL">Commission</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.commission"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">Doc.Charges</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.charges"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div v-if="mode == 'IRR'" :class="rowCss">
        <div :class="colCssL">Rebate</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.rebate"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">Security</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model.number="irr.security"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>
      <div class="row justify-center q-pt-md">
        <q-btn
          class="q-mr-sm"
          color="light-blue"
          label="Auto-Fill"
          @click="autoFill()"
        />
        <q-btn
          v-if="nextValue"
          color="light-blue"
          label="Next"
          @click="nextcal"
        />
      </div>
    </q-card-section>
    <q-card-section v-else class="scroll">
      <IRRCalculation :data="irr" :select="mode" @back="back" @reset="reset" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import IRRCalculation from './IRRCalculation.vue';
import { ref, reactive, onMounted, computed } from 'vue';
import { IrrObject } from './types';
const rowCss =
  'row q-col-gutter-md-md q-col-gutter-sm-sm q-col-gutter-xs-sm justify-center q-pt-sm';
const colCssL =
  'col-12 col-xs-12 col-sm-6 col-md-2 q-mt-xs-sm q-mt-sm-none q-mt-md-sm';
const colCssR = 'col-12 col-xs-12 col-sm-6 col-md-4';
const mode = ref('IRR');
const date = new Date();
const day = date.getDate().toString().padStart(2, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const year = date.getFullYear().toString();
const formattedDate = ref(`${year}-${month}-${day}`);
const nextEmiDisable = ref(true);
const next = ref(true);
const error = ref(false);

const irr = reactive<IrrObject>({});
irr.firstEmi = formattedDate.value;

const autoFill = () => {
  if (mode.value === 'IRR') {
    irr.amount = 10000;
    irr.rate = 18;
    irr.inttMonths = 12;
    irr.installments = 12;
    irr.firstEmi = formattedDate.value;
  } else {
    irr.amount = 10000;
    irr.irr = 31.726;
    irr.inttMonths = 12;
    irr.installments = 12;
    irr.firstEmi = formattedDate.value;
  }
};
const nextEmi = (v: any) => {
  const today = new Date(Date.parse(v));
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const days = ['29', '30', '31'];
  const febdays = ['28', '29'];

  if (month === '01' && days.includes(day)) {
    const year = today.getFullYear().toString();
    const checkYear = parseInt(year);
    if (
      (checkYear % 4 === 0 && checkYear % 100 !== 0) ||
      checkYear % 400 === 0
    ) {
      const day = '29';
      const month = (today.getMonth() + 2).toString().padStart(2, '0');
      irr.nextEmi = `${year}-${month}-${day}`;
    } else {
      const day = '28';
      const month = (today.getMonth() + 2).toString().padStart(2, '0');
      irr.nextEmi = `${year}-${month}-${day}`;
    }
  } else if (day === '31') {
    const day = (today.getDate() - 1).toString().padStart(2, '0');
    const month = (today.getMonth() + 2).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    irr.nextEmi = `${year}-${month}-${day}`;
  } else {
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 2).toString().padStart(2, '0');
    const year = today.getFullYear().toString();
    irr.nextEmi = `${year}-${month}-${day}`;
  }

  if (month === '02' && febdays.includes(day)) {
    nextEmiDisable.value = false;
  } else {
    nextEmiDisable.value = true;
  }
};
const nextcal = () => {
  next.value = !next.value;
};
const back = () => {
  next.value = !next.value;
};
const reset = () => {
  next.value = !next.value;
  irr.amount = null;
  irr.rate = null;
  irr.irr = null;
  irr.inttMonths = null;
  irr.installments = null;
  irr.name = '';
  irr.nextEmi = '';
  irr.advInstallments = null;
  irr.commission = null;
  irr.charges = null;
  irr.rebate = null;
  irr.security = null;
  irr.agreedAmount = null;
  irr.interest = null;
};
const nextValue = computed(() => {
  if (
    !(irr.amount && irr.inttMonths && irr.installments && (irr.rate || irr.irr))
  ) {
    return false;
  } else {
    return true;
  }
});
onMounted(async () => {
  nextEmi(irr.firstEmi);
  error.value = true;
});
</script>

<style scoped></style>
