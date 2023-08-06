<template>
  <div
    class="justify-between q-px-md lt-sm row no-wrap q-pt-sm q-pb-xs brand-header glossy"
  >
    <div v-for="(item, index) in buttonOptions" :key="index">
      <q-btn
        :icon="item.icon"
        class="q-mx-xs"
        flat
        text-color="white"
        size="md"
      >
        <q-badge
          v-if="false"
          color="red-2"
          rounded
          size="sm"
          class="text-weight-bold"
          text-color="red-10"
          style="font-size: 8px"
          floating
          >22
        </q-badge>
      </q-btn>
      <q-separator vertical />
    </div>
  </div>
</template>
<script setup>
const buttonOptions = [
  {
    icon: 'email',
    label: 'Mails',
  },
  {
    icon: 'notifications',
    label: 'Notifications',
  },
  {
    icon: 'chat',
    label: 'Chat Room',
  },
  {
    icon: 'newspaper',
    label: 'newspaper News',
  },
];
</script>
