/**
 * Append to formData
 *
 * @returns {string}
 */
export function appendToFormData(form, key, value) {
	if( value instanceof Array )
	{
		value.forEach((item, key_) => {
			appendToFormData(form, `${key}[${key_}]`, item);
		});
	}
	else
	{
		if( value === null || value === undefined )
		{
			form.append(key, "");
		}
		else if( value === 1 || value === "1" || value === true || value === "true" )
		{
			form.append(key, 1);
		}
		else if( value === 0 || value === "0" || value === false || value === "false" )
		{
			form.append(key, 0);
		}
		else if( typeof value === "object" && value.hasOwnProperty("uri") && value.hasOwnProperty("type") && value.hasOwnProperty("name") )
		{
			form.append(key, value, value.name);
		}
		else
		{
			form.append(key, value);
		}
	}
}
