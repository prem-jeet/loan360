import { useQuasar } from 'quasar';
import { computed } from 'vue';

const useDarkMode = () => {
  const $q = useQuasar();

  const isDark = computed(() => $q.dark.isActive);
  return { isDark };
};

const useScreenSize = () => {
  const $q = useQuasar();

  const screenWidth = computed(() => $q.screen.width);

  return { screenWidth };
};
export { useDarkMode, useScreenSize };
