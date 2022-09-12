/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
	let newObj = JSON.parse(JSON.stringify(obj));
	let array = [...fields];
	for (let value of Object.entries(obj)) {
		if (array.includes(value[0])) delete newObj[value[0]];
	}
	return newObj;
};
