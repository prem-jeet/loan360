<template>
  <div
    class="row full-height flex-center q-gutter-xs-y-md q-pa-xs-md q-pa-lg-xl"
  >
    <div
      v-for="data in moduleCardData"
      :key="data.to"
      class="col-12 col-sm-6 col-md-4 col-lg-3 q-pa-sm-md"
    >
      <router-link
        :to="data.to"
        :style="{ textDecoration: 'none' }"
        v-if="width > 410"
      >
        <q-card
          class="my-card module-card"
          :style="{ backgroundImage: `url(${data.img})` }"
        >
          <div
            class="card-label text-bold absolute full-height full-width column flex-center text-white q-py-sm"
            :style="{ background: 'rgba(0,0,0,0.6)' }"
          >
            <p>{{ data.label }}</p>
            <p v-if="$q.platform.is.desktop">
              Press
              <span class="text-bold q-pa-sm">{{ data.key }}</span> or click
            </p>
          </div>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="bg-blue-4 text-dark text-weight-medium text-subtitle1 text-center q-px-lg q-py-md"
          >
            <div style="max-width: 40ch">{{ data.tooltip }}</div>
          </q-tooltip>
        </q-card>
      </router-link>
      <q-card v-else>
        <q-card-section>
          <p class="card-label">{{ data.label }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn icon="fa-solid fa-link" :to="data.to"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useModuleSelectorKeyboardListener } from 'src/composables/moduleSelectorKeyboardListener';
import { useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useUserStore } from 'src/stores/user/userStore';
import { useMenuStore } from 'src/stores/menu/menuStore';

const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();
const menuStore = useMenuStore();

const width = computed(() => $q.screen.width);

const moduleCardData = [
  {
    img: 'src/assets/img/modules/los.jpg',
    label: 'Loan Origination System',
    to: '/module/los',
    key: 'O',
    tooltip: 'Application to Approval.',
  },
  {
    img: 'src/assets/img/modules/lms.jpg',
    label: 'Loan Management System',
    to: '/module/lms',
    key: 'L',
    tooltip: 'Loan lifecycle management.',
  },
  {
    img: 'src/assets/img/modules/collection.jpg',
    label: 'Collection',
    to: '/module/collection',
    key: 'C',
    tooltip: 'Delinquency classification, Allocation, Repossession.',
  },
  {
    img: 'src/assets/img/modules/fa.jpg',
    label: 'Financial Accounting',
    to: '/module/fa',
    key: 'A',
    tooltip: 'General Ledger/ Financial Accounting module.',
  },
  {
    img: 'src/assets/img/modules/td.jpg',
    label: 'Term Deposits',
    to: '/module/td',
    key: 'D',
    tooltip: 'Management of Deposits & Debentures accepted from Customers.',
  },
  {
    img: 'src/assets/img/modules/maintenance.jpg',
    label: 'Maintenance',
    to: '/module/maintenance',
    key: 'M',
    tooltip:
      'Master Lists maintenance & End of Day/Month handled by System Admins.',
  },
  {
    img: 'src/assets/img/modules/settings.jpg',
    label: 'Settings',
    to: '/module/settings',
    key: 'S',
    tooltip: 'Configurations & Settings handled only by the Solution provider.',
  },
];

useModuleSelectorKeyboardListener(router.push);

onMounted(async () => {
  if (!userStore.appRole.length) {
    await userStore.fetchAppRole();
    await menuStore.fetchMenu();
  }

  menuStore.currentModule = '';
});
</script>

<style scoped lang="scss">
.module-card {
  height: 35vh;
  background-size: cover;
  background-position: center;
}

@media screen and (max-width: 600px) {
  .module-card {
    height: 25vh;
  }
}

.card-label {
  font-size: calc(1vw + 12px);
  color: black;
}
</style>
