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
  <div class="row justify-start q-pa-sm">
    <div class="col">Amount+Intt. {{ irr.agreedAmount }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { IrrObject } from './types';
const rowCss =
  'row q-col-gutter-md-md q-col-gutter-sm-sm q-col-gutter-xs-sm justify-center';
const colCssL = 'col-12 col-xs-4 col-sm-4 col-md-4';
const emits = defineEmits(['back']);

const back = () => {
  emits('back');
};

const props = defineProps({
  data: {
    type: Object,
  },
  select: {
    type: String,
    required: true,
  },
});

const calcInterest = () => {
  if (irr.amount && irr.rate && irr.inttMonths) {
    irr.interest = ((irr.amount * irr.rate) / 100 / 12) * irr.inttMonths;
    irr.agreedAmount = irr.amount + irr.interest;
  }
};
const irr = reactive<IrrObject>({ ...props.data });
onMounted(() => {
  if (props.select === 'IRR') {
    calcInterest();
  } else {
    alert('hi');
  }
});
</script>

<style scoped></style>
