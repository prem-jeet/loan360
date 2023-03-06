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
    moduleMenuItems(state): MenuItem[] | [] {
      return this.orderedUserMenuRights.filter((item) =>
        item.modules?.includes(state.currentModule)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter(key: keyof MenuItem, value: any) {
      const currentModule = this.currentModule;
      if (currentModule === '') return [];

      return this.moduleMenuItems.filter((item) => item[key] === value);
    },
    // eslint-enable-next-line @typescript-eslint/no-explicit-any
  },
});
