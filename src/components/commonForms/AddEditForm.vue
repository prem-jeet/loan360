<template>
  <q-card class="column transparent" :style="{ 'min-width': cardWidth }">
    <q-card-section
      class="q-py-none row justify-between items-center"
      card-header-section
    >
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
      card-main-section
    >
      <q-card-section
        class="col-grow q-pb-xl q-mb-lg"
        :style="{
          'max-height': mainSectionHeight,

          'overflow-Y': 'auto',
        }"
      >
        <slot />
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-px-lg q-py-md absolute-bottom"
        card-bottom-section
      >
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
import { computed } from 'vue';

interface Props {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialObject: { [key: string]: any };

  isEditing: boolean;
}

const props = defineProps<Props>();

const initialData = { ...props.initialObject };
const emits = defineEmits(['close', 'submit', 'reset']);
const { screenWidth } = useScreenSize();

const mainSectionHeight = computed(() =>
  screenWidth.value < 450 ? '88vh' : screenWidth.value < 600 ? '80vh' : '65vh'
);
const cardWidth = computed(() =>
  screenWidth.value < 450
    ? 'auto'
    : screenWidth.value < 600
    ? '90vw'
    : screenWidth.value < 950
    ? '70vw'
    : screenWidth.value < 1250
    ? '50vw'
    : screenWidth.value < 1850
    ? '40vw'
    : '30vw'
);
</script>

<style scoped lang="scss">
[add-edit-form-header] {
  font-size: min(calc(var(--c-font-size) + 2vw), 2rem);
}

[card-main-section] {
  background: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
[card-header-section] {
  background: #c5dcf0;
}
[card-bottom-section] {
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
</style>
