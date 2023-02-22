<template>
  <q-toolbar class="bg-purple-6">
    <q-avatar>
      <img src="src/assets/img/JaguarWhite.png" />
    </q-avatar>
    <q-toolbar-title>
      <p class="text-subtitle1 q-pt-md text-white">Jaguar 360° Cloud</p>
    </q-toolbar-title>
    <q-btn round dense flat color="white" icon="fa-solid fa-envelope">
      <q-badge color="red" text-color="white" floating> 4 </q-badge>
      <q-tooltip>email</q-tooltip>
    </q-btn>
    &nbsp;
    <q-btn round dense flat color="white" icon="fa-solid fa-message">
      <q-badge color="red" text-color="white" floating> 3 </q-badge>
      <q-tooltip>messages</q-tooltip>
    </q-btn>
    &nbsp;
    <q-btn round dense flat color="white" icon="fa-solid fa-comments">
      <q-badge color="red" text-color="white" floating> 4 </q-badge>
      <q-tooltip>sms</q-tooltip>
    </q-btn>
    &nbsp;
    <q-btn round dense flat color="white" icon="fa-solid fa-bell">
      <q-badge color="red" text-color="white" floating> 2 </q-badge>
      <q-tooltip>Notifications</q-tooltip>
    </q-btn>
    &nbsp;

    <RightMenuDropDown />
  </q-toolbar>
</template>
<script setup>
import RightMenuDropDown from 'src/components/modals/RightMenuDropDown.vue';
</script>
