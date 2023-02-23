<template>
  <div class="row inline q-gutter-xl q-pa-xl justify-center">
    <q-card class="module-card">
      <img src="src/assets/img/los.jpeg" class="q-pa-md" />
      <q-card-section>
        <p class="text-subtitle2 text-center">Loan Origination System - O</p>
      </q-card-section>
    </q-card>

    <q-card class="module-card">
      <img
        src="src/assets/img/lms.jpeg"
        class="q-pa-md"
        style="height: 175px"
      />
      <q-card-section>
        <p class="text-subtitle2 text-center">Loan Management System - L</p>
      </q-card-section>
    </q-card>

    <q-card class="module-card">
      <img src="src/assets/img/Collection.png" class="q-pa-md" />
      <q-card-section>
        <p class="text-subtitle2 text-center">Collection - C</p>
      </q-card-section>
    </q-card>

    <q-card class="module-card">
      <img
        src="src/assets/img/Accounts.png"
        class="q-pa-md"
        style="height: 175px"
      />
      <q-card-section>
        <p class="text-subtitle2 text-center">Financial Accounting - A</p>
      </q-card-section>
    </q-card>

    <q-card class="module-card">
      <img
        src="src/assets/img/dep.jpeg"
        class="q-pa-md"
        style="height: 175px"
      />
      <q-card-section>
        <p class="text-subtitle2 text-center">Term Deposits - D</p>
      </q-card-section>
    </q-card>

    <q-card class="module-card">
      <img src="src/assets/img/mnt.png" class="q-pa-md" style="height: 175px" />
      <q-card-section>
        <p class="text-subtitle2 text-center">Maintenance - M</p>
      </q-card-section>
    </q-card>

    <q-card class="module-card">
      <img src="src/assets/img/set.png" class="q-pa-md" style="height: 175px" />
      <q-card-section>
        <p class="text-subtitle2 text-center">Settings - S</p>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
import { useModuleSelectorKeyboardListener } from 'src/composables/moduleSelectorKeyboardListener';
import { useRouter } from 'vue-router';

const router = useRouter();

useModuleSelectorKeyboardListener(router.push);
</script>
<style scoped>
.module-card {
  width: 100%;
  max-width: 250px;
}

@media screen and (max-width: 600px) {
  div {
    padding: 10px;
    margin: 10px;
    width: auto;
  }
}
</style>
