<template>
  <div class="q-pa-md q-gutter-y-lg fit" left-drawer>
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
        node-key="code"
        label-key="name"
        no-connectors
        accordion
        :filter="treeFilter"
        ref="treeRef"
        no-results-label="No result found"
        icon="navigate_next"
        class="q-pb-md"
      >
        <template v-slot:default-header="prop">
          <RouterLink
            :to="`/module/${route.params.module}${prop.node.data.url}`"
            v-if="prop.node.data.url"
            class="text-black"
            :style="{ 'text-decoration': 'none !important' }"
          >
            <div class="flex items-center q-gutter-x-sm cursor-pointer">
              <q-icon :name="prop.node.icon" />
              <span class="q-ml-md">
                {{ prop.node.name }}
              </span>
            </div>
          </RouterLink>
          <div v-else class="flex items-center q-gutter-x-sm cursor-pointer">
            <q-icon :name="prop.node.icon" />
            <span class="q-ml-md">{{ prop.node.name }}</span>
          </div>
        </template>
      </q-tree>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from 'src/stores/menu/menuStore';
import { ref, watch } from 'vue';
import { MenuItem } from 'src/stores/menu/menuStoreTypes';
import { debounce } from 'quasar';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

interface TreeNode {
  name: string;
  icon?: string;
  children: TreeNode[] | [];
  code: string;
  // remove this later
  data: MenuItem;
}
const iconSet = {
  MG: 'fa-regular fa-folder-open',
  MR: 'fa-regular fa-rectangle-list',
  MD: 'fa-regular fa-pen-to-square',
  MP: 'fa-regular fa-pen-to-square',
  MW: 'fa-regular fa-circle-check',
};

const scrollbarVisible = ref(false);
const menuStore = useMenuStore();
const { topLevelMenu } = storeToRefs(menuStore);

const resetFilter = () => {
  filter.value = '';
};

const reduceFn = (
  acc: TreeNode[] | [],
  menuItem: MenuItem
): TreeNode[] | [] => {
  const children =
    menuItem.url === '' || menuItem.url === null
      ? createSubmenu(menuItem.code)
      : [];
  const temp = {
    name: menuItem.name,
    children,
    icon: iconSet[menuItem.menuType as keyof typeof iconSet],
    data: menuItem,
    code: menuItem.code,
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

const createSubmenu = (parentCode: string): TreeNode[] => {
  const subMenuItems = [...menuStore.filter('parentCode', parentCode)];
  return subMenuItems.reduce(reduceFn, []);
};

let treeStructure = createTreeStructure();
const filter = ref('');
const treeFilter = ref('');
const treeRef = ref(null);

const route = useRoute();

watch(
  filter,
  debounce(() => (treeFilter.value = filter.value), 200)
);

watch(topLevelMenu, () => {
  if (topLevelMenu.value.length > 0) {
    // console.log('called', topLevelMenu.value);
    treeStructure = createTreeStructure();
  }
});

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

<style scoped>
.no-scroll {
  overflow: hidden !important;
}
[left-drawer] {
  font-size: calc(var(--c-font-size) * 0.85);
}
</style>
