<template>
  <q-menu fit>
    <q-list style="min-width: 100px">
      <q-item clickable>
        <q-item-section @click="DialogModule = !DialogModule"
          >Modules</q-item-section
        >
      </q-item>
      <q-item clickable>
        <q-item-section>Full Screen</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section @click="DialogCalendar = !DialogCalendar"
          >Calender</q-item-section
        >
      </q-item>
      <q-item clickable>
        <q-item-section>Contacts</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>IRR Calculator</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Eligibility Calculator</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Calculator</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Users</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Menu Rights</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Helpdesk</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Log Out</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <q-dialog v-model="DialogModule" full-width>
    <ModulesDialog />
  </q-dialog>
  <q-dialog v-model="DialogCalendar">
    <CalendarDialog />
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ModulesDialog from 'src/components/modals/RightSideNabBarMenuDialogs/ModulesDialog.vue';
import CalendarDialog from 'src/components/modals/RightSideNabBarMenuDialogs/CalendarDialog.vue';

const DialogModule = ref(false);
const DialogCalendar = ref(false);
</script>
<style scoped>
.q-item {
  min-height: 20px;
}
</style>
