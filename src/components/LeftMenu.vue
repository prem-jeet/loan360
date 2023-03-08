<template>
  <div class="q-py-md q-pl-md q-pr-sm q-gutter-y-lg fit">
    <q-input v-model="filter" label="Filter" standout="bg-blue-grey text-white">
      <template v-slot:append>
        <q-icon
          v-if="filter !== ''"
          name="clear"
          class="cursor-pointer"
          @click="resetFilter"
        />
        <q-icon name="search" v-else />
      </template>
    </q-input>

    <q-scroll-area
      :visible="scrollbarVisible"
      style="height: calc(100% - 70px)"
    >
      <q-tree
        :nodes="treeStructure"
        node-key="label"
        no-connectors
        accordion
        :filter="treeFilter"
        ref="treeRef"
        no-results-label="No result found"
      />
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from 'src/stores/menu/menuStore';
import { ref, watch } from 'vue';
import { MenuItem } from 'src/stores/menu/menuStoreTypes';
import { debounce } from 'quasar';

interface Tree {
  label: string;
  icon?: string;
  children: Tree[] | [];
  data: MenuItem;
}
const iconSet = {
  MG: 'fa-solid fa-folder',
  MR: 'fa-regular fa-rectangle-list',
  MD: 'fa-regular fa-pen-to-square',
  MP: 'fa-regular fa-pen-to-square',
  MW: 'fa-regular fa-circle-check',
};

const scrollbarVisible = ref(false);
const menuStore = useMenuStore();

const resetFilter = () => {
  filter.value = '';
};

const reduceFn = (acc: Tree[] | [], menuItem: MenuItem): Tree[] | [] => {
  const children =
    menuItem.url === '' || menuItem.url === null
      ? createSubmenu(menuItem.code)
      : [];
  const temp = {
    label: menuItem.name,
    children,
    icon: iconSet[menuItem.menuType as keyof typeof iconSet],
    data: menuItem,
  };

  if (menuItem.menuType !== 'MG' || children.length !== 0) {
    acc.push(temp as never);
  }

  return acc;
};

const createTreeStructure = () => {
  const topLevelMenuItems = [...menuStore.topLevelMenu];
  return topLevelMenuItems.reduce(reduceFn, []);
};

const createSubmenu = (parentCode: string): Tree[] => {
  const subMenuItems = [...menuStore.filter('parentCode', parentCode)];
  return subMenuItems.reduce(reduceFn, []);
};

const treeStructure = createTreeStructure();
const filter = ref('');
const treeFilter = ref('');
const treeRef = ref(null);

watch(
  filter,
  debounce(() => (treeFilter.value = filter.value), 200)
);

watch(treeFilter, () => {
  if (treeFilter.value) {
    // @ts-expect-error expandAll is function provided by Quasar
    treeRef.value?.expandAll();
  } else {
    // @ts-expect-error collapseAll is function provided by Quasar
    treeRef.value?.collapseAll();
  }
});
</script>

<style scoped></style>
