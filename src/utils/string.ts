export const capitalCase = (str: string) =>
  str
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

export const firstLetterCpitalze = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const jsonParse = (item: string) => JSON.parse(item);
