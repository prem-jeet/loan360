<template>
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
    <q-list style="min-width: 170px" class="text-table-card-dropdown">
      <template v-for="(item, index) in dropDownItems" :key="item.label">
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-avatar
              :icon="item.icon"
              :color="item.color"
              text-color="white"
              :size="optionsIconsize"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div style="white-space: nowrap">{{ item.label }}</div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-if="index < dropDownItems.length - 1" />
      </template>
    </q-list>
  </q-btn-dropdown>
  <q-btn
    v-if="mobileMenu"
    icon="manage_accounts"
    flat
    round
    dense
    class="cursor-pointer"
    @click="
      () => {
        test();
        isOptionsDialogActive = !isOptionsDialogActive;
      }
    "
  />
  <q-dialog v-model="isOptionsDialogActive" position="bottom" v-if="mobileMenu">
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

      <q-card-section class="q-py-sm q-px-lg">
        <div
          class="column flex-center q-px-md"
          :class="[`dialog-style-${isDark ? 'dark' : 'light'}`]"
          style="border-radius: 20px"
        >
          <template v-for="(item, index) in dropDownItems" :key="item.label">
            <div
              class="q-pa-md self-stretch justify-between flex cursor-pointer items-center"
              :class="[
                index < dropDownItems.length - 1 &&
                  `dialog-style-border-bottom-${isDark ? 'dark' : 'light'}`,
              ]"
            >
              <span>{{ item.label }}</span>
              <q-icon :name="item.icon" />
            </div>
          </template>
        </div>
      </q-card-section>
      <q-card-section class="q-mb-md q-px-lg">
        <div
          class="column flex-center q-px-md"
          :class="[`dialog-style-${isDark ? 'dark' : 'light'}`]"
          style="border-radius: 20px"
        >
          <div
            class="text-red-10 q-pa-md self-stretch justify-between flex items-center cursor-pointer"
          >
            <span>Delete</span>
            <q-icon name="delete" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

interface Props {
  iconSize?: string;
  optionsIconsize?: string;
  mobileMenu: boolean;
}
withDefaults(defineProps<Props>(), {
  iconSize: 'md',
  optionsIconsize: 'md',
  mobileMenu: false,
});

const test = () => console.log('clicked test');

const dropDownItems = [
  { label: 'Edit', icon: 'edit', color: 'blue-7' },
  { label: 'Activate', icon: 'toggle_on', color: 'green-7' },
  { label: 'De-Activate', icon: 'toggle_off', color: 'red-7' },
  { label: 'Delete', icon: 'delete', color: 'red-7' },
];
// { label: 'Delete', icon: 'delete', color: 'red-7' },

const $q = useQuasar();

const isOptionsDialogActive = ref(false);

const isDark = computed(() => $q.dark.isActive);
</script>

<style lang="scss">
.drop-down-dark {
  background: rgba(35, 102, 134, 0.45);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(35, 102, 134, 0.225);
}
.drop-down-light {
  background: rgba(99, 255, 250, 0.2);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 255, 250, 0.1);
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
