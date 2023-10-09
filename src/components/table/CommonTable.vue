<template>
  <q-table
    :rows="rows"
    :columns="[
      {
        name: 'actions',
        label: 'Actions',
        align: 'center',
        field: '',
      },
      ...columns,
    ]"
    separator="cell"
    bordered
    :loading="fetchingData"
    :rows-per-page-options="[0]"
    :hide-bottom="!!rows.length"
    :grid="screenWidth < 1240"
  >
    <template v-slot:header-cell="props">
      <q-th
        :props="props"
        class="text-black"
        style="font-size: 1rem; background-color: #e7f4ff"
      >
        {{ props.col.label }}
      </q-th>
    </template>

    <!-- row design for screens > 800px-->
    <template v-slot:body="props">
      <tr
        class="text-table-row"
        :class="[isDark ? 'table-row-dark' : 'table-row-light']"
      >
        <template :key="key" v-for="key in Object.keys(props.colsMap)">
          <!-- <td v-if="key === 'actions'" style="width: 10ch">
            <div class="flex flex-center">
              <q-btn-group push unelevated>
                <q-btn
                  icon="edit"
                  size="xs"
                  outline
                  rounded
                  color="accent"
                  @click="() => emits('edit', props.row)"
                />
                <q-btn
                  size="xs"
                  outline
                  rounded
                  color="red-5"
                  :label="props.row.inactive ? 'Activate' : 'De-Activate'"
                  @click="() => emits('toggleActiveState', props.row)"
                />
              </q-btn-group>
            </div>
          </td> -->
          <td v-if="key === 'actions'" style="width: 10ch">
            <div class="flex flex-center">
              <TableActions icon-size="md" options-iconsize="sm" />
            </div>
          </td>
          <template v-else>
            <!-- if date type -->
            <td
              :props="props"
              v-if="Date.parse(props.row[key])"
              style="width: 30ch"
            >
              <span class="flex flex-center text-caption">
                <span>
                  {{ date.formatDate(props.row[key], 'DD MMM, YYYY') }}
                </span>

                <q-chip
                  v-if="date.formatDate(props.row[key], 'h:mm A')"
                  icon="schedule"
                  :label="date.formatDate(props.row[key], 'h:mm A')"
                  class="q-mt-xs q-ml-xs text-overline text-weight-medium"
                  color="deep-orange-1"
                  :ripple="false"
                  :dark="false"
                  style="font-size: calc(1vw * 0.75)"
                />
              </span>
            </td>
            <!-- if boolean type -->
            <td
              v-else-if="typeof props.row[key] === 'boolean'"
              style="width: 10ch"
            >
              <div class="flex flex-center">
                <q-icon
                  size="sm"
                  :name="props.row[key] ? 'cancel' : 'check_circle'"
                  :color="
                    props.row[key]
                      ? `red-${isDark ? '5' : '10'}`
                      : `green-${isDark ? '5' : '10'}`
                  "
                />
              </div>
            </td>
            <!-- if text type -->
            <td
              v-else
              :props="props"
              style="max-width: 30ch"
              class="text-subtitle1 text-weight-medium"
            >
              {{ props.row[key] && capitalCase(props.row[key]) }}
            </td>
          </template>
        </template>
      </tr>
    </template>

    <!-- card for grid layout screens < 800px -->
    <template v-slot:item="props">
      <div class="q-pa-sm" :class="[screenWidth < 950 ? 'col-12' : 'col-sm-6']">
        <TableGridCard :data="props.row" :colsMap="props.colsMap" />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import TableGridCard from './TableGridCard.vue';
import TableActions from './TableActions.vue';

import { date, useQuasar } from 'quasar';
import { computed } from 'vue';

import { useScreenSize } from 'src/composables/utilComposibles';
import { capitalCase } from 'src/utils/string';
import { TableColumn } from 'src/types/Common';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: { [key: string]: any }[];
  columns: TableColumn[];
  fetchingData: boolean;
}

defineProps<Props>();

const emits = defineEmits(['edit', 'toggleActiveState']);

const $q = useQuasar();
const { screenWidth } = useScreenSize();

const isDark = computed(() => $q.dark.isActive);
</script>

<style scoped>
.text-table-row * {
  font-size: calc(1vw * 0.9);
  letter-spacing: 0.7px;
}
</style>
