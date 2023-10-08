<template>
  <q-card class="column" :style="{ minWidth: minWidth, minHeight: minHeight }">
    <q-card-section class="q-pb-none">
      <div class="row justify-between items-center">
        <div class="col-10">
          <span add-edit-form-header class="text-h4 text-weight-medium">
            {{ isEditing ? 'Edit' : 'Add' }} {{ label }}
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
      </div>
    </q-card-section>
    <q-form
      class="col-grow column"
      @submit.prevent="emits('submit')"
      @reset="emits('reset', { ...initialData })"
    >
      <q-card-section class="col-grow">
        <slot />
      </q-card-section>
      <q-card-actions align="right" class="q-pa-lg">
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
</script>

<style scoped>
[add-edit-form-header] {
  font-size: calc(var(--c-font-size) + 1vw);
}
</style>
