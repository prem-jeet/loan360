<template>
  <q-toolbar class="bg-purple-6">
    <q-avatar>
      <img :src="logo" />
    </q-avatar>
    <q-toolbar-title>
      <router-link
        :to="{ name: 'moduleSelector' }"
        :style="{ textDecoration: 'none' }"
      >
        <p class="text-subtitle1 q-pt-md text-white">Jaguar 360° Cloud</p>
      </router-link>
    </q-toolbar-title>
    <RightMenuDropDown />
  </q-toolbar>
</template>
<script setup lang="ts">
import RightMenuDropDown from 'src/components/RightMenuDropDown/RightMenuDropDown.vue';
import logo from 'src/assets/img/JaguarWhite.png';
</script>
