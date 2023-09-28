<template>
  <div class="q-ml-sm">
    <q-btn
      round
      color="teal-14"
      text-color="teal-12"
      class="text-weight-bold text-h5"
      size="25px"
      padding="sm md"
      :label="(userAvatar as string)"
    >
      <q-menu
        transition-show="jump-down"
        transition-hide="jump-up"
        auto-close
        max-width="300px"
      >
        <div class="q-pa-md column items-center">
          <span class="text-subtitle1 q-my-none text-weight-medium">
            {{ userStore.decodedIdToken.given_name }}
            {{ userStore.decodedIdToken.middle_name }}
            {{ userStore.decodedIdToken.family_name }}
          </span>
          <div class="flex items-center text-weight-bold q-py-sm">
            <span>Email Verified</span>
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
          </div>

          <q-btn
            color="secondary"
            @click="logout"
            label="Logout"
            icon="logout"
            push
            size="sm"
            v-close-popup
          />
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
    </q-btn>

    <q-dialog v-model="showEligibilityCalculator">
      <EligibilityCalculator />
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import EligibilityCalculator from 'src/components/RightMenuDropDown/RightMenuDropDownOptions/EligibilityCalculator/EligibilityCalculator.vue';
import { useUserStore } from 'src/stores/user/userStore';
import { asyncConfirmDialog } from 'src/utils/notification';

const userStore = useUserStore();

const showEligibilityCalculator = ref(false);

const userAvatar = computed(() =>
  userStore.decodedIdToken.given_name
    ? userStore.decodedIdToken.given_name.charAt(0).toUpperCase()
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

const logout = async () => {
  const confirm = await asyncConfirmDialog({
    title: 'Logout ?',
    msg: 'Are you sure you want to logout ?',
  });

  if (confirm) {
    localStorage.clear();
    window.location.assign('/');
  }
};
</script>
<style scoped>
.q-item {
  min-height: 20px;
}
</style>
