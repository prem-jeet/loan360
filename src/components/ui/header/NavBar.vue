<template>
  <q-toolbar class="bg-purple-6 inline row">
    <q-btn
      flat
      @click="openMenu"
      round
      dense
      icon="menu"
      class=""
      v-if="route.name !== 'moduleSelector'"
    />
    <q-avatar>
      <img :src="logo" />
    </q-avatar>
    <q-toolbar-title>
      <router-link
        :to="{ name: 'moduleSelector' }"
        :style="{ textDecoration: 'none' }"
      >
        <p class="text-subtitle1 q-pt-md text-white">Jaguar 360°</p>
      </router-link>
    </q-toolbar-title>
    <div
      class="q-mr-md gt-xs"
      v-for="(item, index) in buttonOptions"
      :key="index"
    >
      <q-btn
        color="teal-2"
        rounded
        :icon="item.icon"
        class="q-mx-xs"
        :text-color="item.textColor"
        padding="10px"
        size="md"
      >
        <q-badge
          v-if="false"
          color="red-2"
          rounded
          size="sm"
          class="text-weight-bold"
          text-color="red-10"
          style="font-size: 8px"
          floating
          >22
        </q-badge>
      </q-btn>
    </div>
    <RightMenuDropDown />
  </q-toolbar>
  <div class="example-row-variable-width bg-white shadow-0">
    <div
      class="row"
      :class="$q.screen.width > 640 ? 'justify-end' : 'justify-center'"
    >
      <div class="bg-cyan-7 flex rounded-borders">
        <q-separator dark vertical />
        <q-btn-dropdown
          push
          glossy
          no-caps
          stretch
          flat
          @click="openCompanyModal()"
          class="fluid q-px-xs-xs q-px-sm-sm"
          :label="
            $q.screen.width > 640
              ? userStore.selectedCompany.name
              : userStore.selectedCompany.name.slice(0, 7)
          "
          icon="business"
        />
        <q-separator dark vertical />
        <q-btn-dropdown
          push
          glossy
          no-caps
          stretch
          @click="openCompanyModal()"
          class="fluid q-px-xs-xs q-px-sm-sm"
          flat
          icon="burst_mode"
          :label="
            $q.screen.width > 640
              ? userStore.selectedBranch.name
              : userStore.selectedBranch.code
          "
        />
        <q-separator dark vertical />
        <q-btn-dropdown
          push
          glossy
          no-caps
          flat
          @click="openCompanyModal()"
          class="fluid q-px-xs-xs q-px-sm-sm"
          icon="edit_calendar"
          :label="
            $q.screen.width > 640
              ? userStore.selectedFinancialYear.name
              : `${fromDate} - ${toDate}`
          "
        />
        <q-separator dark vertical />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import RightMenuDropDown from 'src/components/RightMenuDropDown/RightMenuDropDown.vue';
import logo from 'src/assets/img/JaguarWhite.png';
import { useRoute } from 'vue-router';
import { useUserStore } from 'src/stores/user/userStore';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const userStore = useUserStore();

const emits = defineEmits(['openMenu']);
const route = useRoute();
const openMenu = () => emits('openMenu');
const fromDate = formatDate(userStore.selectedFinancialYear.fromDate, 'YY');
const toDate = formatDate(userStore.selectedFinancialYear.toDate, 'YY');
const buttonOptions = [
  {
    textColor: 'cyan-10',
    icon: 'email',
    label: 'Mails',
  },
  {
    textColor: 'red-8',
    icon: 'notifications',
    label: 'Notifications',
  },
  {
    textColor: 'blue-8',
    icon: 'chat',
    label: 'Chat Room',
  },
  {
    textColor: 'blue-grey-10',
    icon: 'newspaper',
    label: 'newspaper News',
  },
];
const openCompanyModal = () => {
  userStore.openCompanySelectModal(true);
};
</script>
