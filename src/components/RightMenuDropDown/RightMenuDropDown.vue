<template>
  <q-btn flat :ripple="false" class="bg-purple-6">
    Jaguar software india
    <q-menu fit auto-close>
      <q-list style="min-width: 100px">
        <q-item @click="toggleFullscreen" clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-expand" />
          </q-item-section>
          <q-item-section>Full Screen</q-item-section>
        </q-item>
        <q-separator />
        <q-item to="/moduleselector" class="text-black">
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-home" />
          </q-item-section>
          <q-item-section avatar> Modules</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-calendar" />
          </q-item-section>
          <q-item-section>Calender</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-address-card" />
          </q-item-section>
          <q-item-section>Contacts</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-calculator" />
          </q-item-section>
          <q-item-section>IRR Calculator</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          @click="showEligibilityCalculator = !showEligibilityCalculator"
        >
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-calculator" />
          </q-item-section>
          <q-item-section>Eligibility Calculator</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-calculator" />
          </q-item-section>
          <q-item-section>Calculator</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-users" />
          </q-item-section>
          <q-item-section>Users</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-gears" />
          </q-item-section>
          <q-item-section>Menu Rights</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          href="https://jaguarsoftwareindia.freshdesk.com/support/login"
          target="_blank"
          clickable
        >
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-circle-question" />
          </q-item-section>
          <q-item-section>Helpdesk</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="logOut">
          <q-item-section avatar>
            <q-icon size="xs" name="fa-solid fa-right-from-bracket" />
          </q-item-section>
          <q-item-section>Log Out</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <q-dialog v-model="showEligibilityCalculator">
    <EligibilityCalculator />
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import EligibilityCalculator from 'src/components/RightMenuDropDown/RightMenuDropDownOptions/EligibilityCalculator/EligibilityCalculator.vue';
import { logOut } from 'src/utils/auth/login';
const showEligibilityCalculator = ref(false);

const toggleFullscreen = () => {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullscreen = docEl.requestFullscreen;
  const exitFullscreen = doc.exitFullscreen;

  if (!doc.fullscreenElement) {
    if (requestFullscreen) {
      requestFullscreen.call(docEl);
    }
  } else {
    if (exitFullscreen) {
      exitFullscreen.call(doc);
    }
  }
};
</script>
<style scoped>
.q-item {
  min-height: 20px;
}
</style>
