import { Platform } from 'quasar';
import { onMounted, onUnmounted } from 'vue';

type moduleUrlKeys =
  | 'los'
  | 'lms'
  | 'collection'
  | 'fa'
  | 'td'
  | 'maintenance'
  | 'settings';

const moduleUrls = {
  los: '/module/los',
  lms: '/module/lms',
  collection: '/module/collection',
  fa: '/module/fa',
  td: '/module/td',
  maintenance: '/module/maintenance',
  settings: '/module/settings',
};

export function useModuleSelectorKeyboardListener(
  navigationFunction: (to: string) => void
) {
  const navigateToUrl = (key: moduleUrlKeys) =>
    navigationFunction(moduleUrls[key]);

  const callback = (ev: KeyboardEvent) => {
    const { key, ctrlKey, shiftKey, altKey } = ev;

    if (ctrlKey || shiftKey || altKey) return;

    /* loan origination system */
    if (key === 'o' || key === 'O') {
      navigateToUrl('los');
      return;
    }

    /* loan management system */
    if (key === 'l' || key === 'L') {
      navigateToUrl('lms');
      return;
    }

    /* collection */
    if (key === 'c' || key === 'C') {
      navigateToUrl('collection');
      return;
    }

    /* financial accounting */
    if (key === 'a' || key === 'a') {
      navigateToUrl('fa');
      return;
    }

    /* term deposit */
    if (key === 'd' || key === 'D') {
      navigateToUrl('td');
      return;
    }

    /* maintenance */
    if (key === 'm' || key === 'M') {
      navigateToUrl('maintenance');
      return;
    }

    /* setting */
    if (key === 's' || key === 's') {
      navigateToUrl('settings');
      return;
    }
  };

  onMounted(() => {
    if (Platform.is.desktop) {
      console.log('Listening for keypress....');
      window.addEventListener('keydown', callback);
    }
  });
  onUnmounted(() => {
    if (Platform.is.desktop) {
      console.log('Stopped listening for keypress....');
      document.removeEventListener('keydown', callback);
    }
  });
}
