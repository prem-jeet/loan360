<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <NavBar />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
import NavBar from 'src/components/modals/NavBar.vue';
export default defineComponent({
  name: 'MainLayout',
  components: {
    NavBar
  },

})
</script>
