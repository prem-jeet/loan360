<template>
  <q-btn
    label="logout"
    icon="logout"
    size="lg"
    padding="md sm"
    @click="logout"
    color="red-7"
  />
</template>

<script setup lang="ts">
import { asyncConfirmDialog } from 'src/utils/notification';

const logout = async () => {
  const confirm = await asyncConfirmDialog({
    title: 'Logout ?',
    msg: 'Are you sure you want to logout ?',
  });

  if (confirm) {
    localStorage.clear();
    window.location.assign('/');
  }
};
</script>

<style scoped></style>
