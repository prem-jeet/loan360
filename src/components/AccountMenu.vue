<template>
  <q-list style="letter-spacing: 0.6px" account-menu class="text-weight-medium">
    <q-item @click="toggleFullscreen" clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="open_in_full" />
      </q-item-section>

      <q-item-section>Full Screen</q-item-section>
    </q-item>

    <q-item to="/moduleselector">
      <q-item-section thumbnail>
        <q-icon size="md" name="view_module" />
      </q-item-section>
      <q-item-section thumbnail style="color: black"> Modules</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="calendar_month" />
      </q-item-section>
      <q-item-section>Calender</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="contacts" />
      </q-item-section>
      <q-item-section>Contacts</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="calculate" />
      </q-item-section>
      <q-item-section>IRR Calculator</q-item-section>
    </q-item>

    <q-item
      clickable
      @click="showEligibilityCalculator = !showEligibilityCalculator"
    >
      <q-item-section thumbnail>
        <q-icon size="md" name="rule" />
      </q-item-section>
      <q-item-section>Eligibility Calculator</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="calculate" />
      </q-item-section>
      <q-item-section>Calculator</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="people" />
      </q-item-section>
      <q-item-section>Users</q-item-section>
    </q-item>

    <q-item clickable>
      <q-item-section thumbnail>
        <q-icon size="md" name="account_tree" />
      </q-item-section>
      <q-item-section>Menu Rights</q-item-section>
    </q-item>

    <q-item
      href="https://jaguarsoftwareindia.freshdesk.com/support/login"
      target="_blank"
      clickable
    >
      <q-item-section thumbnail>
        <q-icon size="md" name="help" />
      </q-item-section>
      <q-item-section>Help Desk</q-item-section>
    </q-item>
  </q-list>

  <q-dialog v-model="showEligibilityCalculator">
    <EligibilityCalculator />
  </q-dialog>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EligibilityCalculator from 'src/components/calculators/EligibilityCalculator.vue';

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

onMounted(() => console.log('mounted account menu'));
</script>
<style scoped>
[account-menu] > .q-item {
  min-height: calc(100vh / 15);
  padding-left: 20px;
}
</style>
