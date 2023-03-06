<template>
  <q-card class="e-card" flat bordered>
    <q-item class="bg-light-blue-5 text-white q-pa-none q-ma-none">
      <q-item-section>
        <q-toolbar class="q-pa-none q-ma-none bg-purple-6">
          <p>IRR Calculator</p>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-item-section>
    </q-item>
    <q-card-section class="scroll"> </q-card-section>
    <div class="row q-col-gutter-xs q-pa-sm">
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-input outlined dense v-model="name" input-class="text-right" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-input outlined dense v-model="name" input-class="text-right" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-input outlined dense v-model="name" input-class="text-right" />
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3">
        <q-input outlined dense v-model="name" input-class="text-right" />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const name = ref('kkkk');
</script>

<style scoped></style>
