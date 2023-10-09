<template>
  <q-card table-data-card>
    <q-card-section class="row items-center" v-if="headerKey">
      <div class="text-h5 text-uppercase">
        {{ data[headerKey].toLocaleUpperCase() }}
      </div>
      <q-space />
      <TableActions icon-size="lg" />
    </q-card-section>
    <q-card-section>
      <div class="absolute-right">
        <TableActions icon-size="lg" :mobile-menu="true" />
      </div>

      <div class="row border" v-for="(value, key) of data" :key="key">
        <template v-if="colsMap[key] && (!hideNullData || value !== null)">
          <div class="col-4 q-pa-xs q-py-sm text-uppercase flex items-center">
            {{ colsMap[key].label }}
          </div>
          <div
            class="col-auto q-pl-sm q-py-sm flex items-center text-weight-medium text-subtitle1"
            style="letter-spacing: 0.6px"
            :style="{ width: screen < 930 ? '49vw' : '23vw' }"
          >
            <template v-if="Date.parse(value)">
              {{ date.formatDate(new Date(value), 'D MMM, YYYY') }}
              <div class="flex items-center q-ml-xs">
                <q-icon name="schedule" />
                {{ date.formatDate(new Date(value), 'hh:mm') }}
              </div>
            </template>
            <template v-else-if="typeof value === 'boolean'">
              <div class="flex flex-center">
                <q-icon
                  size="sm"
                  :name="value ? 'cancel' : 'check_circle'"
                  :color="
                    value
                      ? `red-${isDark ? '10' : '6'}`
                      : `green-${isDark ? '9' : '6'}`
                  "
                />
              </div>
            </template>
            <div v-else>{{ value }}</div>
          </div>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TableActions from './TableActions.vue';

// import ExpandingTextArea from 'src/components/ExpandingTextArea.vue';

import { date, useQuasar } from 'quasar';

interface Props {
  data: { [key: string]: string };
  colsMap: { [key: string]: { [key: string]: string; label: string } };
  headerKey?: string;
  hideNullData?: boolean;
}
defineProps<Props>();

const $q = useQuasar();
const isDark = computed(() => $q.dark.isActive);
const screen = computed(() => $q.screen.width);
</script>

<style lang="scss" scoped>
[table-data-card] {
  // background: #56c3fb73;
  // -webkit-backdrop-filter: blur(14px);
  // backdrop-filter: blur(14px);
  // border: 1px solid rgba(86, 195, 251, 0.225);

  background: rgba(85, 195, 250, 0.3);
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
  border: 1px solid rgba(85, 195, 250, 0.15);
}
.body--dark [table-data-card] {
  background: rgba(43, 85, 98, 0.45);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  outline: 1px solid rgba(43, 85, 98, 0.225);
}
</style>
<style></style>
