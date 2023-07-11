<template>
  <q-dialog v-model="isActive" @before-hide="close" persistent>
    <q-card :style="{ minWidth: '300px' }">
      <q-card-section class="row items-center bg-grey-2">
        <div class="text-h6">Merge</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-12 q-mb-md text-center text-weight-medium text-h5">
            Merge
          </div>
          <div
            class="col-12"
            v-for="accountHead in toBeRemovedAccountHeads"
            :key="accountHead.id"
          >
            <div class="row justify-between items-center">
              <div>{{ accountHead.name }}</div>
              <div><q-checkbox v-model="accountHead.isSelected" /></div>
            </div>
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-12 text-center text-weight-medium text-h5 q-mb-md">
            With
          </div>
          <div class="col-12">
            <q-select
              v-model="parentAccountHead"
              :options="duplicateList"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              outlined
              behavior="menu"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions class="q-py-md bg-grey-2" align="center">
        <q-btn label="merge" icon="merge" color="teal-5" @click="merge" />
        <q-btn label="cancel" @click="close" color="red-5" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { alertDialog, asyncConfirmDialog } from 'src/utils/notification';
import { ref, watch } from 'vue';

interface Props {
  duplicateList: { id: number; name: string }[];
}

const emits = defineEmits(['close', 'merge']);
const props = defineProps<Props>();

const isActive = ref(true);
const parentAccountHead = ref(props.duplicateList[0].id);
const toBeRemovedAccountHeads = ref(
  props.duplicateList
    .filter((accountHead) => accountHead.id !== parentAccountHead.value)
    .map((accountHead) => ({ ...accountHead, isSelected: false }))
);

const merge = async () => {
  const ids = toBeRemovedAccountHeads.value
    .filter(({ isSelected }) => isSelected)
    .map(({ id }) => id);
  const id = parentAccountHead.value;

  if (!ids.length) {
    alertDialog('Please select account to be merged.', 'Error');
    return;
  }

  const confirmation = await asyncConfirmDialog({
    title: 'Confirm',
    msg: 'Are you sure you want to merge ?',
  });

  if (confirmation) {
    emits('merge', { id, ids });
    close();
  }
};
const close = () => {
  emits('close');
};

watch(parentAccountHead, (newVal, oldVal) => {
  const temp = toBeRemovedAccountHeads.value.filter(
    ({ id }) => id !== parentAccountHead.value
  );

  const newEntry = props.duplicateList.filter(({ id }) => oldVal === id)[0];

  temp.push({ ...newEntry, isSelected: false });

  toBeRemovedAccountHeads.value = [...temp];
});
</script>

<style scoped></style>
