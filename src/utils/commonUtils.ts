export const getMultiSelectOptions_Util = (options: object) => {
  const arr: { label: string; value: string }[] = [];
  Object.entries(options).map(function (key) {
    arr.push({
      value: key[0],
      label: key[1],
    });
  });
  return arr;
};

// Getting single quote format. So ne need to use Join everywhere for an String Array
export const SelectedDataFormat_Util = (item: string[]) => {
  return item.length > 0 ? item.map((d) => `'${d}'`).join(',') : "' '";
};
