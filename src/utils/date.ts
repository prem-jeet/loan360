import { date } from 'quasar';

export const formatDate = (inputDate: string) => {
  return date.formatDate(inputDate, 'DD/MM/YYYY@hh:mmA');
};
