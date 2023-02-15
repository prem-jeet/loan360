import { onMounted, onUnmounted } from 'vue';

type moduleUrls =
  | '/los'
  | '/lms'
  | '/collection'
  | '/fa'
  | '/td'
  | '/maintenance'
  | '/setting';

const navigateToUrl = (url: moduleUrls) => window.location.assign(url);

const callback = ({ key }: { key: string }) => {
  /* loan origination system */
  if (key === 'o' || key === 'O') {
    navigateToUrl('/los');
    return;
  }

  /* loan management system */
  if (key === 'l' || key === 'L') {
    navigateToUrl('/lms');
    return;
  }

  /* collection */
  if (key === 'c' || key === 'C') {
    navigateToUrl('/collection');
    return;
  }

  /* financial accounting */
  if (key === 'a' || key === 'a') {
    navigateToUrl('/fa');
    return;
  }

  /* term deposit */
  if (key === 'd' || key === 'D') {
    navigateToUrl('/td');
    return;
  }

  /* maintenance */
  if (key === 'm' || key === 'M') {
    navigateToUrl('/maintenance');
    return;
  }

  /* setting */
  if (key === 's' || key === 's') {
    navigateToUrl('/setting');
    return;
  }
};

export function useModuleSelectorKeyboardListener() {
  onMounted(() => {
    console.log('Listening for keypress....');
    window.addEventListener('keydown', callback);
  });
  onUnmounted(() => {
    console.log('Stopped listening for keypress....');
    document.removeEventListener('keydown', callback);
  });
}
