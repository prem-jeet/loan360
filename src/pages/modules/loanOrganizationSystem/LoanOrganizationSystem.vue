<template>
  <div>loan organization system</div>
</template>

<script setup>
import { useMenuStore } from 'stores/menu';

import { storeToRefs } from 'pinia';

const menuStore = useMenuStore();

const { menu } = storeToRefs(menuStore);

console.log(menu.value);
</script>

<style lang="scss" scoped></style>
