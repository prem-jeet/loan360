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
    <q-card-section class="scroll">
      <div :class="rowCss">
        <div :class="colCssL">Mode</div>
        <div :class="colCssR">
          <q-select
            outlined
            dense
            v-model="mode"
            :options="modes"
            label="Mode"
          />
        </div>
        <div :class="colCssL">
          Amount
          <span class="text-red">*</span>
        </div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">Rate <span class="text-red">*</span></div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">
          Intt.for Mnths
          <span class="text-red">*</span>
        </div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">Installments <span class="text-red">*</span></div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">Name</div>
        <div :class="colCssR">
          <q-input outlined dense v-model="name" />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">1st EMI Date</div>
        <div :class="colCssR">
          <q-input outlined dense v-model="formattedDate" type="date" />
        </div>
        <div :class="colCssL">2nd EMI Date</div>
        <div :class="colCssR">
          <q-input outlined dense v-model="nextMonth" />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">Advance EMIs</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">Commission</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">Doc.Charges</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL">Rebate</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
      </div>

      <div :class="rowCss">
        <div :class="colCssL">Security</div>
        <div :class="colCssR">
          <q-input
            outlined
            dense
            v-model="name"
            type="number"
            input-class="text-right remove-input-number-indicator"
          />
        </div>
        <div :class="colCssL"></div>
        <div :class="colCssR"></div>
      </div>

      <div class="row justify-center q-pt-md">
        <q-btn class="q-mr-sm" color="light-blue" label="Auto-Fill" />
        <q-btn color="light-blue" label="Next" v-close-popup />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const rowCss = 'row q-col-gutter-sm justify-center q-pt-xs';
const colCssL =
  'col-12 col-xs-12 col-sm-6 col-md-2 q-mt-xs-sm q-mt-sm-none q-mt-md-sm';
const colCssR = 'col-12 col-xs-12 col-sm-6 col-md-4';
const mode = ref('');
const modes = ref(['IRR', 'ReverseIRR']);
const name = ref(0);
const date = new Date();
const day = date.getDate().toString().padStart(2, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const year = date.getFullYear().toString();
const formattedDate = ref(`${year}-${month}-${day}`);
const nextMonth = ref('h');
</script>

<style scoped></style>
