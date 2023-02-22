import { defineStore } from 'pinia';
import { getMenu } from 'src/utils/testData/menu';

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
    menu: [{}],
  }),
  getters: {},
  actions: {
    async fetchMenu() {
      const rsp: object[] = await getMenu();

      this.menu = rsp;
      return rsp;
    },
  },
});
