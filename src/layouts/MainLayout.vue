<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <NavBar @openMenu="openMenu" />
    </q-header>
    <q-page-container>
      <q-page>
        <RouterView @openMenu="openMenu"></RouterView>
      </q-page>
    </q-page-container>
    <q-drawer v-model="drawerLeft" overlay elevated>
      <LeftMenu />
    </q-drawer>
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/NavBar.vue';
import LeftMenu from 'src/components/LeftMenu.vue';
import { ref } from 'vue';

const drawerLeft = ref(false);

const openMenu = () => {
  drawerLeft.value = !drawerLeft.value;
};
</script>
