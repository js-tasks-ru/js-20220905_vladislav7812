/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
	let result = "";
	let count = 0;
	let current;
	if (typeof size === 'undefined') return string;
	if (size !== 0) {
		for (const value of string) {
			if (value !== current) {
				current = value;
				count = 0;
			} else {
				count++;
			}
			if (count < size) {
				result += value;
			}
		}
	}
	return result;
}
