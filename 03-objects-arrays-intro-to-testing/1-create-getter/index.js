/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
	const array = [...(path.split("."))];
	return function func(obj, index = 0) {
		const value = array[index];
		if (typeof obj[value] === 'object') {
			return func(obj[value], index + 1);
		}
		else {
			return obj[value];
		}
	}
}



