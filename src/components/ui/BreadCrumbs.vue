<template>
  <q-chip
    color="white"
    class="shadow-3 q-py-md-md py-xs-medium q-mx-xs-none"
    :class="customCss || 'q-mx-md-lg ma-sm-none'"
    :ripple="false"
    dense
  >
    <q-breadcrumbs gutter="xs" active-color="indigo" class="q-py-md-xs">
      <template v-slot:separator>
        <q-icon size="1.6em" name="directions" color="indigo" />
      </template>

      <q-breadcrumbs-el
        class="q-px-xs-sm q-py-xs-xs text-subtitle1"
        to="/moduleSelector"
        icon="house"
      />
      <q-breadcrumbs-el
        class="q-px-md-sm text-weight-medium q-px-xs-sm q-py-xs-xs"
        v-for="{ path, label, disable } in orderedPaths"
        :key="label"
        :to="path"
        :label="label"
        :disable="disable || false"
      />
    </q-breadcrumbs>
  </q-chip>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  orderedPaths: { path: string; label: string; disable?: boolean }[];
  styleCss?: string;
}>();

const customCss = ref(props.styleCss);
</script>

<style scoped lang="scss"></style>
