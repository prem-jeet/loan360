<template>
  <q-select
    outlined
    v-model="computedSelected"
    :options="filteredOptions"
    multiple
    options-selected-class="bg-deep-orange-6 text-white"
    :hide-selected="false"
    :label="props.label"
    menu-shrink
    popup-content-style="height: 300px"
  >
    <template v-slot:before-options>
      <q-item>
        <q-item-section>
          <div class="row items-center">
            <template v-if="filteredOptions.length">
              <q-btn
                :icon="isAllSelected ? 'playlist_remove' : 'playlist_add_check'"
                size="sm"
                color="grey-10"
                @click="toggleSelection"
                round
                class="q-ml-xs"
              >
                <q-tooltip>
                  {{ isAllSelected ? 'Select none' : 'Select all' }}
                </q-tooltip>
              </q-btn>
            </template>
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
          </div>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps">
        <q-item-section>
          <div class="row items-center">
            <q-checkbox
              :model-value="selected"
              @update:model-value="toggleOption(opt)"
            />
            {{ opt.label }}
          </div>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section>
          <div class="row items-center">
            <template v-if="filteredOptions.length">
              <q-btn
                :icon="isAllSelected ? 'playlist_remove' : 'playlist_add_check'"
                size="sm"
                color="grey-10"
                @click="toggleSelection"
                round
                class="q-ml-xs"
              >
                <q-tooltip>
                  {{ isAllSelected ? 'Select none' : 'Select all' }}
                </q-tooltip>
              </q-btn>
            </template>
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
          </div>
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
        {{ opt[displaySelectedLables ? 'label' : 'value'] }}
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
  maxChips?: number;
  displaySelectedLables?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxChips: 4,
  displaySelectedLables: true,
});

const emit = defineEmits(['update:modelValue']);

const query = ref('');

const selected = ref([...props.modelValue]);

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

const isAllSelected = computed(
  () => computedSelected.value.length === props.options.length
);

const toggleSelection = () => {
  if (isAllSelected.value) {
    emit('update:modelValue', []);
  } else {
    emit('update:modelValue', [...props.options]);
  }
};

watch(selected, () => emit('update:modelValue', selected.value));
</script>
