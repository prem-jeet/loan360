<template>
  <div
    class="justify-between q-px-md lt-sm row no-wrap q-pt-sm q-pb-xs brand-footer"
  >
    <div v-for="(item, index) in buttonOptions" :key="index">
      <q-btn
        :icon="item.icon"
        class="q-mx-xs"
        flat
        :text-color="item.textColor"
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
    textColor: 'blue-grey-10',
    icon: 'email',
    label: 'Mails',
  },
  {
    textColor: 'blue-grey-10',
    icon: 'notifications',
    label: 'Notifications',
  },
  {
    textColor: 'blue-grey-10',
    icon: 'chat',
    label: 'Chat Room',
  },
  {
    textColor: 'blue-grey-10',
    icon: 'newspaper',
    label: 'newspaper News',
  },
];
</script>
