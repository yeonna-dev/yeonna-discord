/* Check if the given value is a valid number. */
export function isNumber(numberString: string): boolean
{
  return ! numberString || isNaN(parseFloat(numberString)) || ! /^\d+(\.\d+)?$/g.test(numberString);
}
