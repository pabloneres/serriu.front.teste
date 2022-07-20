export default function(array, key, value) {
	return array.findIndex((item) => item[key] === value)
}