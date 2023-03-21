export const isLeapYear = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

export const changeMonthBy = (date: Date, changeBy?: number) => {
  const monthIndex = date.getMonth();
  const newMonthIndex = (monthIndex + (changeBy || 0)) % 12;
  const newMonth = (newMonthIndex < 0 ? 13 + newMonthIndex : newMonthIndex + 1)
    .toString()
    .padStart(2, '0');
  return newMonth;
};
