<template>
  <q-toolbar class="brand-header inline row glossy">
    <q-btn
      flat
      @click="openMenu"
      round
      dense
      icon="menu"
      class=""
      v-if="route.name !== 'moduleSelector'"
    />
    <q-separator
      v-if="route.name !== 'moduleSelector'"
      class="q-mr-sm q-ml-xs"
      color="grey"
      inset
      vertical
    />
    <q-img :src="logo" style="height: 37px; width: 50px" class="q-ml-xs" />
    <q-toolbar-title class="q-mt-sm">
      <router-link
        :to="{ name: 'moduleSelector' }"
        :style="{ textDecoration: 'none' }"
      >
        <p
          class="text-h6 text-h6-xs q-mt-sm-sm q-mt-xs-md row text-white text-weight-medium"
        >
          <span class="col col-shrink"> Jaguar 360° </span>
          <span class="col col-shrink"> &nbsp;Cloud </span>
        </p>
      </router-link>
    </q-toolbar-title>
    <div
      class="row inline q-mr-sm gt-xs transparent"
      v-for="(item, index) in buttonOptions"
      :key="index"
    >
      <q-btn
        text-color="white"
        :icon="item.icon"
        class="q-mx-xs"
        padding="4px"
        size="10px"
        flat
      >
        <q-badge
          v-if="false"
          color="red-2"
          rounded
          size="xs"
          class="text-weight-bold"
          text-color="red-10"
          style="font-size: 8px"
          floating
          >22
        </q-badge>
      </q-btn>
    </div>
    <q-separator
      v-if="$q.screen.width > 600"
      inset
      vertical
      class="q-mr-sm q-ml-xs"
      color="grey"
    />
    <RightMenuDropDown />
  </q-toolbar>
  <div class="example-row-variable-width bg-white shadow-0">
    <div
      class="row"
      :class="$q.screen.width > 600 ? 'justify-end' : 'justify-center'"
    >
      <div class="brand-button flex rounded-borders">
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
            $q.screen.width > 600
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
            $q.screen.width > 600
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
            $q.screen.width > 600
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
    icon: 'email',
    label: 'Mails',
  },
  {
    icon: 'notifications',
    label: 'Notifications',
  },
  {
    icon: 'chat',
    label: 'Chat Room',
  },
  {
    icon: 'newspaper',
    label: 'newspaper News',
  },
];
const openCompanyModal = () => {
  userStore.openCompanySelectModal(true);
};
</script>
