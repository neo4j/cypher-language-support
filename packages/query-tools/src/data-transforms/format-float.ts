export const formatFloat = (anything: number) => {
  if ([Infinity, -Infinity, NaN].includes(anything)) {
    return `${anything}`;
  }
  if (Math.floor(anything) === anything) {
    return `${anything}.0`;
  }
  return anything.toString();
};
