<template>
  <q-select
    outlined
    dense
    v-model="selected"
    multiple
    :options="options"
    clearable
    hide-bottom-space
    menu-shrink
    behavior="menu"
    options-selected-class="bg-primary text-white"
    placeholder="hello"
    :label="selected?.length ? '' : 'None Selected'"
  >
    <template v-slot:selected-item="scope">
      <q-chip
        removable
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        size="sm"
        color="grey-4"
      >
        {{ scope.opt.label }}
      </q-chip>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Option {
  label: string;
  value: string;
}

const props = defineProps<{
  options: Option[];
  selectedOptions?: Option[] | null;
}>();

const emits = defineEmits(['updated']);

const reset = () => (selected.value = null);

const selected = ref<Option[] | null>(null);

watch(selected, () => {
  if (selected.value) {
    emits('updated', [...selected.value]);
  } else {
    emits('updated', null);
  }
});

onMounted(() => {
  if (props.selectedOptions?.length) {
    selected.value = props.selectedOptions;
  }
});

defineExpose({
  reset,
});
</script>

<style scoped></style>
