<template>
  <q-card style="width: 300px">
    <q-card-section>
      <div class="text-h6">Alert</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <h1>hi</h1>
      {{ editObject }}
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
interface EditObject {
  name: string;
  inactive: boolean;
}

const props = defineProps({
  editObject: {
    type: Object as () => EditObject,
    required: true,
  },
});
</script>

<style scoped></style>
