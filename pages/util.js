/**
 * Converts a database date object with format yyyy-mm-ddThh:mm:ss.msmsmsZ to two strings with format yyyy.mm.dd and hh:mm
 * @param {String} date
 * @returns an array with two strings said as above.
 */
export const getDateTime = date => {
  const D = date.split("T")[0].replaceAll("-", ".");
  const T = date.split("T")[1].substring(0, 5);
  return [D, T];
};

/**
 * Checks if second string is inside the first, not case sensitive.
 * @param {*} s1 string 1
 * @param {*} s2 string 2
 * @returns true if strings are inside, false otherwise
 */
export const includesNoCase = (s1, s2) => {
  return s1.toLowerCase().includes(s2.toLowerCase());
}