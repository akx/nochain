/**
 * Like `String#split` but returns the remaining bits as a single slice.
 * @param string
 * @param delimiter
 * @param count
 * @returns {*}
 */
module.exports.splitMaxCount = function (string, delimiter, count) {
  const bits = string.split(delimiter);
  const start = bits.slice(0, count);
  const rest = bits.slice(count);
  if (rest.length) return start.concat(rest.join(delimiter));
  return start;
};
