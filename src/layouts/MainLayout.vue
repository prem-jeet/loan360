<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <NavBar />
    </q-header>
    <q-page-container>
      <q-page>
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import NavBar from 'src/components/modals/NavBar.vue';
</script>
