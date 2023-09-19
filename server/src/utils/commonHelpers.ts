/**
 * Parses a string to an integer and returns
 * the result if successful otherwise the original
 * string
 * @param str string
 */
export function tryParseInt(str: string) {
  const parsedInt = parseInt(str);
  return isNaN(parsedInt) ? str : parsedInt;
}

/**
 * Returns a string representation of an array
 * @param array
 */
export function stringifyArray(array: string[] | number[]) {
  const str = array.join(", ");

  return `[ ${str} ]`;
}
