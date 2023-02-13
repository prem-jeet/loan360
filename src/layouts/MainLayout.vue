<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <NavBar />
    </q-header>
    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import NavBar from 'src/components/modals/NavBar.vue';
</script>
