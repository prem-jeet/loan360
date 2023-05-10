import { date } from 'quasar';

export const formatDate = (inputDate: string, format: string) => {
  return date.formatDate(inputDate, format);
};
