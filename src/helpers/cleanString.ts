/**
 * Trims the given string and replaces all two or more spaces to one.
 *
 * @param {string} string
 */
export function cleanString(string: string)
{
  return string
    .trim()
    .replace(/\s\s+/g, ' ');
}