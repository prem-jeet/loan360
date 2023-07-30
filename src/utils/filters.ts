export const inactiveFilter = (
  dataArr: { [key: string]: unknown; inactive: boolean }[]
) => dataArr.filter((item) => !item.inactive) as unknown;
