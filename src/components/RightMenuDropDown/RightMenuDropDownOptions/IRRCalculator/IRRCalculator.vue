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
      <div
        class="row q-col-gutter-md-md q-col-gutter-sm-none q-col-gutter-xs-none justify-center q-pa-sm"
      >
        <div class="col-xs-12 col-sm-6 col-md-2">
          <p class="q-pt-sm">Mode</p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-select
            outlined
            dense
            v-model="mode"
            :options="modes"
            label="Mode"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2">
          <p class="q-pt-sm">
            Amount
            <span>*</span>
          </p>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4">
          <q-input outlined dense v-model="name" input-class="text-right" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const mode = ref('');
const modes = ref(['IRR', 'ReverseIRR']);
const name = ref('kkkk');
</script>

<style scoped></style>
