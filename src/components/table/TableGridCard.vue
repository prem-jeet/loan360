<template>
  <q-card table-data-card>
    <q-card-section class="row items-center" v-if="headerKey">
      <div class="text-h5 text-uppercase">
        {{ data[headerKey].label.toLocaleUpperCase() }}
      </div>
      <q-space />
      <TableActions
        icon-size="lg"
        :mobile-menu="screenWidth < 531"
        :inactive="(data.inactive as boolean)"
        :delete-option="deleteOption"
        @edit="() => emits('edit')"
        @toggle-activate-state="emits('toggleActiveState')"
        @delete="emits('delete')"
      />
    </q-card-section>
    <q-card-section>
      <div class="absolute-right">
        <TableActions
          icon-size="lg"
          :mobile-menu="screenWidth < 531"
          :inactive="(data.inactive as boolean)"
          :delete-option="deleteOption"
          @edit="() => emits('edit')"
          @toggle-activate-state="emits('toggleActiveState')"
          @delete="emits('delete')"
        />
      </div>

      <div
        class="row items-center"
        v-for="(value, key, index) of data"
        :key="key"
        :class="{
          'q-pt-md': index > 0,
        }"
        style="font-size: min(calc(3vw), 18px)"
      >
        <template v-if="colsMap[key] && (!hideNullData || value !== null)">
          <div class="col-4 text-uppercase flex items-center">
            {{ colsMap[key].label }}
          </div>
          <div
            class="col-auto q-pl-sm flex items-center text-weight-medium"
            style="letter-spacing: 0.6px"
            :style="{
              fontSize: 'min(calc(3.1vw), 22px)',
              width: screenWidth < 930 ? '49vw' : '28vw',
            }"
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
                  :size="screenWidth < 700 ? 'xs' : 'sm'"
                  :name="value ? 'check_circle' : 'cancel'"
                  :color="
                    value
                      ? `red-${isDark ? '10' : '6'}`
                      : `green-${isDark ? '9' : '6'}`
                  "
                />
              </div>
            </template>
            <div v-else>{{ value && capitalCase(value) }}</div>
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
import { useScreenSize } from 'src/composables/utilComposibles';
import { capitalCase } from 'src/utils/string';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any };
  // eslint-enable-next-line @typescript-eslint/no-explicit-any
  colsMap: { [key: string]: { [key: string]: string; label: string } };
  headerKey?: string;
  hideNullData?: boolean;
  deleteOption?: boolean;
}

defineProps<Props>();
const emits = defineEmits(['edit', 'toggleActiveState', 'delete']);

const $q = useQuasar();
const { screenWidth } = useScreenSize();
const isDark = computed(() => $q.dark.isActive);
</script>

<style lang="scss" scoped>
[table-data-card] {
  background: #e7f4ff;
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
