import { useUserStore } from 'src/stores/user/userStore';
import { api } from 'src/boot/axios';
import { MenuItem, State } from './menuStoreTypes';
import { defineStore } from 'pinia';

const menuSortCompareFn = (a: MenuItem, b: MenuItem): -1 | 1 | 0 => {
  if (a.itemOrder > b.itemOrder) {
    return 1;
  }
  if (a.itemOrder < b.itemOrder) {
    return -1;
  }
  return 0;
};

export const useMenuStore = defineStore('menuStore', {
  state: (): State => ({
    menu: [],
    userMenuRights: [],
    currentModule: '',
  }),
  getters: {
    orderedUserMenuRights: (state) => {
      if (state.userMenuRights.length) {
        const temp = [...state.userMenuRights];
        temp.sort(menuSortCompareFn);
        return temp;
      }

      return [];
    },
    filter() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (key: keyof MenuItem, value: any): MenuItem[] | [] => {
        const currentModule = this.currentModule;
        if (currentModule === '') return [];

        return this.moduleMenuItems.filter((item) => item[key] === value);
      };
      // eslint-enable-next-line @typescript-eslint/no-explicit-any
    },

    moduleMenuItems(state): MenuItem[] | [] {
      return this.orderedUserMenuRights.filter(
        (item) => item.modules?.includes(state.currentModule) && item.roleType
      );
    },

    topLevelMenu(): MenuItem[] | [] {
      if (!this.moduleMenuItems.length) return [];

      return this.filter('parentCode', null);
    },
    subMenu() {
      return (parenMenuItem: MenuItem): MenuItem[] | [] =>
        this.moduleMenuItems.filter(
          (item) => item.parentCode === parenMenuItem.code
        );
    },
  },
  actions: {
    async fetchMenu(): Promise<MenuItem | []> {
      const rsp = await api.get('menu');

      if (!rsp.data) {
        return [];
      }

      this.fetchUserRightsMenu();
      this.topLevelMenu; // Calling To update the Menu Data From API

      this.menu = rsp.data;
      return rsp.data;
    },
    async fetchUserRightsMenu(): Promise<MenuItem | []> {
      const userStore = useUserStore();

      const login = userStore.decodedIdToken['cognito:username'];
      const roles = userStore.appRole.map((role) => role.roleCode);

      const rsp = await api.post('getUserMenuRights/login', { login, roles });

      if (!rsp.data) {
        return [];
      }

      this.userMenuRights = rsp.data;

      return rsp.data;
    },
  },
});
