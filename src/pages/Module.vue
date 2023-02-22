<template>
  <div>{{ module }}</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
