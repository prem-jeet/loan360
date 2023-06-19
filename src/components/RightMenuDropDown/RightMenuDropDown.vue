<template>
  <div class="q-ml-sm">
    <q-btn round :ripple="true" glossy class="brand-sub-header">
      <q-avatar size="32px">
        {{ userAvatar }}
      </q-avatar>
    </q-btn>
    <q-menu auto-close fit>
      <div class="row no-wrap q-pa-md">
        <div class="column items-center">
          <div class="q-mb-none">
            <h6 class="text-subtitle1 q-my-none text-weight-bolder">
              {{ userStore.decodedIdToken.given_name }}
              {{ userStore.decodedIdToken.middle_name }}
              {{ userStore.decodedIdToken.family_name }}
            </h6>
            <p class="inline text-weight-bold">
              Email Verified
              <q-icon
                v-if="userStore.decodedIdToken.email_verified"
                name="verified"
                color="green"
                size="sm"
                class="q-ml-xs"
              />
              <q-icon
                name="cancel"
                class="q-ml-xs"
                color="red"
                size="sm"
                v-else
              />
            </p>
          </div>

          <q-btn
            color="secondary"
            clickable
            @click="logout"
            label="Logout"
            icon="logout"
            push
            size="sm"
            v-close-popup
          />
        </div>
      </div>
      <q-separator />
      <q-list>
        <q-item @click="toggleFullscreen" clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="open_in_full" />
          </q-item-section>

          <q-item-section>Full Screen</q-item-section>
        </q-item>
        <q-separator />
        <q-item to="/moduleselector" class="text-black q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="view_module" />
          </q-item-section>
          <q-item-section thumbnail> Modules</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="fa-solid fa-calendar" />
          </q-item-section>
          <q-item-section>Calender</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="contacts" />
          </q-item-section>
          <q-item-section>Contacts</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="calculate" />
          </q-item-section>
          <q-item-section>IRR Calculator</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          clickable
          class="q-px-lg"
          @click="showEligibilityCalculator = !showEligibilityCalculator"
        >
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="rule" />
          </q-item-section>
          <q-item-section>Eligibility Calculator</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="fa-solid fa-calculator" />
          </q-item-section>
          <q-item-section>Calculator</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="people" />
          </q-item-section>
          <q-item-section>Users</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="q-px-lg">
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="account_tree" />
          </q-item-section>
          <q-item-section>Menu Rights</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          href="https://jaguarsoftwareindia.freshdesk.com/support/login"
          target="_blank"
          clickable
          class="q-px-lg"
        >
          <q-item-section thumbnail>
            <q-icon size="xs" color="black" name="help" />
          </q-item-section>
          <q-item-section>Help Desk</q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-menu>
    <q-dialog v-model="showEligibilityCalculator">
      <EligibilityCalculator />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import EligibilityCalculator from 'src/components/RightMenuDropDown/RightMenuDropDownOptions/EligibilityCalculator/EligibilityCalculator.vue';
import { useUserStore } from 'src/stores/user/userStore';
const userStore = useUserStore();

const showEligibilityCalculator = ref(false);

const userAvatar = computed(() =>
  userStore.decodedIdToken.given_name
    ? userStore.decodedIdToken.given_name.charAt(0)
    : null
);

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
const logout = () => {
  localStorage.clear();
};
</script>
<style scoped>
.q-item {
  min-height: 20px;
}
</style>
