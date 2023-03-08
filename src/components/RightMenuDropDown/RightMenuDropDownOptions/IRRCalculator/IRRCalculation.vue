<template>
  <div :class="rowCss">
    <div :class="colCssL">
      <q-btn color="light-blue" label="back" @click="back" />
    </div>
    <div :class="colCssL">
      <q-btn color="light-blue" label="Next" />
    </div>
    <div :class="colCssL">
      <q-btn color="light-blue" label="Back" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const rowCss =
  'row q-col-gutter-md-md q-col-gutter-sm-sm q-col-gutter-xs-sm justify-center';
const colCssL = 'col-12 col-xs-12 col-sm-12 col-md-4';
const emits = defineEmits(['back']);

const back = () => {
  emits('back');
};
</script>

<style scoped></style>
