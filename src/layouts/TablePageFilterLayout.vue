<template>
  <q-expansion-item header-style="display:none" v-model="expanded">
    <q-card class="q-pb-md q-px-sm" table-filter-card>
      <q-card-section class="flex items-center">
        <div class="text-weight-medium" filter-title>Filter</div>
        <q-space />
        <q-btn
          padding="sm "
          icon="close"
          :size="screenWidth < 540 ? 'xs' : 'md'"
          rounded
          color="red-5"
          @click="emits('update:modelValue', false)"
        />
      </q-card-section>
      <q-card-section>
        <slot />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { useScreenSize } from 'src/composables/utilComposibles';
import { computed } from 'vue';
const props = defineProps({
  modelValue: Boolean,
});
const emits = defineEmits(['update:modelValue']);
const expanded = computed(() => props.modelValue);
const { screenWidth } = useScreenSize();
</script>

<style scoped>
[filter-title] {
  font-size: calc(var(--c-font-size) + 0.5vw);
  letter-spacing: 1px;
}
[table-filter-card] {
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  /* border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 3px 10px -5px black;
  border-radius: 10px; */
}
</style>
