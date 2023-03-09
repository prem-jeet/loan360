<template>
  <q-breadcrumbs gutter="md">
    <template v-slot:separator>
      <q-icon size="1rem" name="fa-solid fa-location-arrow" color="primary" />
    </template>

    <q-breadcrumbs-el to="/moduleSelector" label="Home" />
    <q-breadcrumbs-el
      v-for="{ path, label } in orderedPaths"
      :key="label"
      :to="path"
      :label="label"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
const props = defineProps<{
  orderedPaths: { path: string; label: string }[];
}>();
</script>

<style scoped></style>
