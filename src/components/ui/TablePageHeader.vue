<template>
  <div class="row items-center q-px-md q-px-md-lg">
    <div class="col-grow">
      <span page-header-text class="text-weight-medium"> {{ title }} </span>
    </div>
    <div class="col-auto">
      <q-btn
        color="green-12"
        text-color="black"
        padding="sm"
        rounded
        :size="screenWidth < 540 ? 'sm' : 'md'"
        icon="add"
        @click="emits('add')"
      />
      <q-btn
        color="indigo-12"
        padding="sm"
        rounded
        :size="screenWidth < 540 ? 'sm' : 'md'"
        icon="filter_list"
        class="q-ml-md"
        @click="emits('filter')"
      />
    </div>
  </div>
</template>

<script setup>
import { useScreenSize } from 'src/composables/utilComposibles';

const { screenWidth } = useScreenSize();

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['add', 'filter']);
</script>

<style lang="scss" scoped>
[page-header-text] {
  font-size: calc(var(--c-font-size) + 1vw);
  letter-spacing: 1px;
}
</style>
