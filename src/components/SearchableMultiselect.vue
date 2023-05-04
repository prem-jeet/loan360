<template>
  <q-select
    outlined
    v-model="computedSelected"
    :options="filteredOptions"
    multiple
    options-selected-class="bg-teal-9 text-teal-1"
    :hide-selected="false"
    :label="props.label"
    menu-shrink
    popup-content-style="height: 300px"
    options-dense
  >
    <template v-slot:before-options>
      <q-item>
        <q-item-section avatar>
          <q-input
            v-model="query"
            placeholder="search"
            autofocus
            dense
            @click.stop=""
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section v-if="filteredOptions.length">
          <q-btn
            @click="allSelected = !allSelected"
            :icon="allSelected ? 'playlist_remove' : 'playlist_add_check'"
            :color="allSelected ? 'red' : 'teal'"
            padding="sm"
          >
            <q-tooltip>
              {{ allSelected ? 'Deselect all' : 'Select all' }}
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <q-checkbox
            :model-value="selected"
            @update:model-value="toggleOption(opt)"
            color="grey-10"
            :label="opt.label"
          />
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section>
          <q-input
            v-model="query"
            placeholder="search"
            autofocus
            dense
            class="q-ml-sm"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          <q-icon name="warning" color="orange-10" />
        </q-item-section>
        <q-item-section class="text-italic text-grey">
          <q-item-label>No result found</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="{ index, opt }">
      <q-chip
        v-if="index < maxChips"
        color="purple-2"
        text-color="purple-10"
        class="text-weight-medium"
      >
        {{ opt[chipKey] }}
      </q-chip>
      <q-chip v-if="index === maxChips" color="indigo-3" text-color="indigo-8">
        <q-avatar icon="add" color="indigo-8" text-color="indigo-3" />
        {{ computedSelected.length - maxChips }} more
      </q-chip>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

type Option = { label: string; value: string };
interface Props {
  options: Option[];
  modelValue: Option[];
  label: string;
  maxChips: number;
  chipKey: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);

const query = ref('');

const selected = ref([...props.modelValue]);

const allSelected = ref(props.modelValue.length === props.options.length);

const computedSelected = computed({
  get() {
    return [...props.modelValue];
  },
  set(newValue) {
    selected.value = [...newValue];
  },
});

const filteredOptions = computed(() => [
  ...props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(query.value.toLowerCase()) ||
      option.value.toLowerCase().includes(query.value.toLowerCase())
  ),
]);

watch(
  allSelected,
  () => (selected.value = allSelected.value ? [...props.options] : [])
);
watch(selected, () => emit('update:modelValue', selected.value));
</script>
