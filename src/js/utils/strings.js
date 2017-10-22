export const pad = (value, length, padString = '0') => {
  let result = value.toString() || '';

  while (result.length < length) {
    result = `${padString}${result}`;
  }

  return result;
};

export const toHumanReadable = (value) => {
  let hours = parseInt(value / 3600, 10);
  let minutes = parseInt(value / 60, 10) % 60;
  let seconds = (value % 60).toFixed(0);

  hours = pad(hours, 2);
  minutes = pad(minutes, 2);
  seconds = pad(seconds, 2);

  if (value < 3600) {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
};

export default { pad, toHumanReadable };
