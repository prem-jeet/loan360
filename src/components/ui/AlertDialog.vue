<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :position="position">
    <q-card class="q-dialog-plugin" :style="{ maxWidth: '350px' }">
      <q-card-section
        class="row q-gutter-x-sm items-center q-py-sm bg-negative text-white"
      >
        <q-icon name="warning" size="sm" color="yellow" />
        <span class="text-h6">{{ title }}</span>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section
        :style="{ minHeight: '100px' }"
        class="text-subtitle1 bg-grey-2 text-weight-medium"
      >
        {{ msg }}
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-py-sm">
        <q-btn color="primary" label="OK" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

type DialogPositions =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'standard'
  | undefined;

defineProps<{
  msg: string;
  title: string;
  position: DialogPositions;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
</script>
