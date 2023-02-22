<template>
  <q-toolbar class="bg-purple-6">
    <q-avatar>
      <img src="src/assets/img/JaguarWhite.png" />
    </q-avatar>
    <q-toolbar-title>
      <p class="text-subtitle1 q-pt-md text-white">Jaguar 360° Cloud</p>
    </q-toolbar-title>
    <RightMenuDropDown />
  </q-toolbar>
</template>
<script setup>
import RightMenuDropDown from 'src/components/modals/RightMenuDropDown.vue';
</script>
