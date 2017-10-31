export const pad = (value, length, padString = '0') => {
  let result = value.toString() || '';

  while (result.length < length) {
    result = `${padString}${result}`;
  }

  return result;
};

export const toHumanReadable = (value) => {
  const hours = parseInt(value / 3600, 10);
  const minutes = parseInt(value / 60, 10) % 60;
  const seconds = pad((value % 60).toFixed(0), 2);

  if (value < 3600) {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
};

export default { pad, toHumanReadable };
