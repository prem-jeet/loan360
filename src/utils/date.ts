import { date } from 'quasar';

export const formatDate = (inputDate: string, formate: string) => {
  return date.formatDate(inputDate, formate);
};
