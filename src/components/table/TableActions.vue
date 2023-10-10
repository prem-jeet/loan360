<template>
  <!-- drop down menu for larger screens -->
  <q-btn-dropdown
    v-if="!mobileMenu"
    v-model="isOptionsDialogActive"
    dropdown-icon="manage_accounts"
    :size="iconSize"
    flat
    rounded
    dense
    auto-close
    no-icon-animation
    :content-class="[`${isDark ? 'drop-down-dark' : 'drop-down-light'}`]"
  >
    <q-list style="min-width: 170px">
      <template v-for="(value, key, index) in options" :key="key">
        <q-item clickable v-close-popup @click="emits(value.emit)">
          <q-item-section avatar>
            <q-avatar
              :icon="value.icon"
              :color="value.color"
              text-color="white"
              :size="optionsIconsize"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div style="white-space: nowrap">{{ key }}</div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-if="index < Object.keys(options).length - 1" />
      </template>
      <template v-if="deleteOption">
        <q-separator />
        <q-item clickable v-close-popup @click="emits('delete')">
          <q-item-section avatar>
            <q-avatar
              icon="delete"
              color="red-7"
              text-color="white"
              :size="optionsIconsize"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div style="white-space: nowrap">Delete</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-btn-dropdown>
  <!-- dialog type menu for mobile -->
  <template v-else>
    <q-btn
      icon="manage_accounts"
      flat
      round
      dense
      class="cursor-pointer"
      @click="closeDialog"
    />
    <q-dialog v-model="isOptionsDialogActive" position="bottom">
      <q-card
        style="border-radius: 30px 30px 0px 0px; letter-spacing: 1px"
        :class="[
          `text-${isDark ? 'white' : 'black'}`,
          `table-row-operations-dialog-${isDark ? 'dark' : 'light'}`,
          'text-weight-medium text-body1',
        ]"
      >
        <q-card-section class="q-pa-xs q-mb-md">
          <div class="row">
            <div class="col-4 q-mx-auto">
              <q-linear-progress :value="1" color="pink" />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-py-sm q-px-lg" v-close-popup>
          <div
            class="column flex-center q-px-md cursor-pointer"
            :class="[`dialog-style-${isDark ? 'dark' : 'light'}`]"
            style="border-radius: 20px"
          >
            <template v-for="(value, key, index) in options" :key="key">
              <div
                @click="emits(value.emit)"
                class="q-pa-md self-stretch justify-between flex items-center"
                :class="[
                  index < Object.keys(options).length - 1 &&
                    `dialog-style-border-bottom-${isDark ? 'dark' : 'light'}`,
                ]"
              >
                <span>{{ key }}</span>
                <q-icon :name="value.icon" />
              </div>
            </template>
          </div>
        </q-card-section>
        <q-card-section
          class="q-mb-md q-px-lg"
          v-if="deleteOption"
          @click="emits('delete')"
          v-close-popup
        >
          <div
            class="column flex-center q-px-md cursor-pointer"
            :class="[`dialog-style-${isDark ? 'dark' : 'light'}`]"
            style="border-radius: 20px"
          >
            <div
              class="text-red-10 q-pa-md self-stretch justify-between flex items-center"
            >
              <span>Delete</span>
              <q-icon name="delete" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

interface Props {
  iconSize?: string;
  optionsIconsize?: string;
  mobileMenu?: boolean;
  deleteOption?: boolean;
  inactive: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  iconSize: 'md',
  optionsIconsize: 'md',
  mobileMenu: false,
  deleteOption: false,
});

const emits = defineEmits(['edit', 'toggleActivateState', 'delete']);

const options = computed(() => ({
  Edit: {
    icon: 'edit',
    color: 'blue-7',
    emit: 'edit' as 'edit' | 'toggleActivateState' | 'delete',
  },

  [`${props.inactive ? '' : 'De-'}Activate`]: {
    icon: `toggle_${props.inactive ? 'on' : 'off'}`,
    color: `${props.inactive ? 'green' : 'red'}-7`,
    emit: 'toggleActivateState' as 'edit' | 'toggleActivateState' | 'delete',
  },
}));

const $q = useQuasar();

const isOptionsDialogActive = ref(false);

const isDark = computed(() => $q.dark.isActive);

const closeDialog = () =>
  (isOptionsDialogActive.value = !isOptionsDialogActive.value);
</script>

<style lang="scss">
.drop-down-dark {
  background: rgba(35, 102, 134, 0.45);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(35, 102, 134, 0.225);
}
.drop-down-light {
  background: rgba(131, 149, 255, 0.2);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 255, 250, 0.1);
  font-size: max(calc(1vw * 1.05), calc(var(--c-font-size) * 0.8));
  font-weight: 500;
  letter-spacing: 0.7px;
}

.dialog-style-border-bottom-light {
  border-bottom: 1px solid hsla(0, 0%, 50%, 0.5);
}
.dialog-style-border-bottom-dark {
  border-bottom: 1px solid hsla(0, 0%, 92%, 0.5);
}
.dialog-style-dark {
  background-color: rgb(21, 21, 21);

  color: white;
}
.dialog-style-light {
  background-color: rgb(226, 226, 226);
  color: rgb(16, 29, 63);
}
.table-row-operations-dialog-dark {
  background: rgba(49, 49, 49, 0.25);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(49, 49, 49, 0.125);
}
.table-row-operations-dialog-light {
  background: rgba(255, 255, 255, 0.25);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
</style>
