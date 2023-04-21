import { Dialog, Notify } from 'quasar';
import AlertDialog from 'src/components/ui/AlertDialog.vue';

type NotifyPositions =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | undefined;

type DialogPositions =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'standard'
  | undefined;

export const onSuccess = (data: {
  msg: string;
  icon?: string;
  position?: NotifyPositions;
}) => {
  Notify.create({
    message: data.msg,
    color: 'green-8',
    position: data.position || 'top',
    icon: data.icon || '',
  });
};

export const onFailure = (data: {
  msg: string;
  icon?: string;
  position?: NotifyPositions;
}) => {
  Notify.create({
    message: data.msg,
    color: 'red-8',
    position: data.position || 'top',
    icon: data.icon || '',
  });
};

export const confirmDialog = (
  okHandler: () => void,
  options: {
    cancelHandler?: () => void;
    dismissHandler?: () => void;
    title?: string;
    msg?: string;
    cardClasses?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    okButton?: string | { [key: string]: any };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cancelButton?: string | { [key: string]: any };
    position?: DialogPositions;
  }
) => {
  const {
    cancelHandler = () => ({}),
    dismissHandler = () => ({}),
    title = 'Confirm',
    msg = 'Are you sure?',
    cardClasses,
    position,
    okButton = true,
    cancelButton = true,
  } = options;

  Dialog.create({
    title: title,
    message: msg,
    position: position || 'top',
    class: cardClasses,
    focus: 'none',
    ok: okButton,
    cancel: cancelButton,
  })
    .onOk(okHandler)
    .onCancel(cancelHandler)
    .onDismiss(dismissHandler);
};
export const alertDialog = (
  msg: string,
  title = 'Alert',
  position?: DialogPositions
) => {
  Dialog.create({
    component: AlertDialog,
    componentProps: {
      title,
      msg,
      position: position || 'top',
    },
  });
};
