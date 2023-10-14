<template>
  <q-card class="column" :style="{ minWidth: minWidth, minHeight: minHeight }">
    <q-card-section class="q-py-none row justify-between items-center">
      <div class="col-10">
        <span add-edit-form-header class="text-h4 text-weight-medium">
          {{ isEditing ? 'Edit ' : 'Add ' }}{{ label }}
        </span>
      </div>
      <div class="col-auto">
        <q-btn
          padding="sm"
          size="xs"
          rounded
          icon="close"
          color="red-5"
          @click="emits('close')"
        />
      </div>
    </q-card-section>
    <q-form
      class="col-grow column"
      @submit.prevent="emits('submit')"
      @reset="emits('reset', { ...initialData })"
    >
      <q-card-section
        class="col-grow"
        :style="{
          'max-height': `${screenWidth < 600 ? '85vh' : '65vh'}`,
          'min-height': '200px',
          'overflow-Y': 'auto',
        }"
      >
        <slot />
      </q-card-section>
      <q-card-actions align="right" class="q-pa-lg absolute-bottom">
        <q-btn
          type="submit"
          v-if="isEditing"
          icon="save"
          color="primary"
          label="Save"
        />
        <q-btn
          v-else
          type="submit"
          icon="add"
          color="green-12"
          text-color="black"
          label="add"
        />
        <q-btn type="reset" icon="refresh" label="reset" color="red-5" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useScreenSize } from 'src/composables/utilComposibles';

interface Props {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialObject: { [key: string]: any };
  minWidth?: string;
  minHeight?: string;
  isEditing: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: 'auto',
  minWidth: '375px',
});

const initialData = { ...props.initialObject };
const emits = defineEmits(['close', 'submit', 'reset']);
const { screenWidth } = useScreenSize();
</script>

<style scoped>
[add-edit-form-header] {
  font-size: min(calc(var(--c-font-size) + 2vw), 2rem);
}
</style>
