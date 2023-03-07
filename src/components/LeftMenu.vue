<template>
  <q-scroll-area class="fit" :visible="scrollbarVisible">
    <q-tree :nodes="treeStructure" node-key="label" />
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useMenuStore } from 'src/stores/menu/menuStore';
import { ref } from 'vue';
import { MenuItem } from 'src/stores/menu/menuStoreTypes';

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

console.log(treeStructure);
</script>

<style scoped></style>
