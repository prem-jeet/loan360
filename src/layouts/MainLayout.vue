<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <NavBar />
    </q-header>
    <q-page-container>
      <q-page>
        <RouterView></RouterView>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/NavBar.vue';
</script>
