<template>
  <q-card>
    <q-item class="bg-light-blue-5 text-white q-pa-none q-ma-none">
      <q-item-section>
        <q-toolbar class="q-pa-none q-ma-none bg-purple-6">
          <p class="text-weight-medium q-pt-md q-px-md">Calendar</p>
          <q-space />
          <p>{{ date }}</p>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-item-section>
    </q-item>
    <q-separator />
    <div class="q-pa-md">
      <div class="q-gutter-md row items-start">
        <q-date v-model="date" />
      </div>
    </div>
  </q-card>
</template>
<script>
import { ref } from 'vue';
export default {
  setup() {
    return {
      date: ref('2019/02/01'),
    };
  },
};
</script>
