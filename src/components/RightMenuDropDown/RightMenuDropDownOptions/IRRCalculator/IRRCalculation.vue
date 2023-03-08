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
    <div class="col">Amount+Intt. NaN</div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
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
});
const irr = reactive<IrrObject>({ ...props.data });
console.log(irr);
</script>

<style scoped></style>
