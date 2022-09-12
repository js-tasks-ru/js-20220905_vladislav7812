/* eslint-disable indent */
/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
	let sorted = [];
	let arrCopy = [...arr];
	let collator = new Intl.Collator(['ru', 'en-US'], {
		caseFirst: "upper"
	});
	if (param === 'desc') {
		let sorting = (a, b) => {
			if (collator.compare(a, b) < 0) return 1;
			if (collator.compare(a, b) == 0) return 0;
			if (collator.compare(a, b) > 0) return -1;
		};
		sorted = arrCopy.sort(sorting).slice();
	} else {
		let sorting = (a, b) => {
			if (collator.compare(a, b) > 0) return 1;
			if (collator.compare(a, b) == 0) return 0;
			if (collator.compare(a, b) < 0) return -1;
		};
		sorted = arrCopy.sort(sorting).slice();
	}
	return sorted;
}
