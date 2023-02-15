<template>
  <q-menu fit>
    <q-list style="min-width: 100px">
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-expand"
        /></q-item-section>
        <q-item-section>Full Screen</q-item-section>
      </q-item>

      <q-item to="/moduleselector">
        <q-item-section avatar>
          <q-icon name="fa-solid fa-home"
        /></q-item-section>
        <q-item-section avatar> Modules</q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-calendar"
        /></q-item-section>
        <q-item-section @click="DialogCalendar = !DialogCalendar"
          >Calender</q-item-section
        >
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-address-card"
        /></q-item-section>
        <q-item-section>Contacts</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-calculator"
        /></q-item-section>
        <q-item-section>IRR Calculator</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-calculator"
        /></q-item-section>
        <q-item-section>Eligibility Calculator</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-calculator"
        /></q-item-section>
        <q-item-section>Calculator</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-users"
        /></q-item-section>
        <q-item-section>Users</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-gears"
        /></q-item-section>
        <q-item-section>Menu Rights</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-circle-question"
        /></q-item-section>
        <q-item-section>Helpdesk</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section avatar>
          <q-icon name="fa-solid fa-right-from-bracket"
        /></q-item-section>
        <q-item-section>Log Out</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <q-dialog v-model="DialogCalendar">
    <CalendarModule />
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import CalendarModule from 'src/components/modals/RightSideNabBarMenuDialogs/CalendarModule.vue';

const DialogCalendar = ref(false);
</script>
<style scoped>
.q-item {
  min-height: 20px;
}

.q-item.q-router-link--active,
.q-item--active {
  color: #1b1c1d;
}
</style>
