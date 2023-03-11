import { Notify } from 'quasar';

type Positions =
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

export const onSuccess = (data: {
  msg: string;
  icon?: string;
  position?: Positions;
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
  position?: Positions;
}) => {
  Notify.create({
    message: data.msg,
    color: 'red-8',
    position: data.position || 'top',
    icon: data.icon || '',
  });
};
