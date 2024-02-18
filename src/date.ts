import { invalid_argument } from "./errors";

/**
 * Internal function to convert a Date object to YYYYMMDD-formatted string
 * 
 * @param date The Date object
 * @returns Formatted string
 */
export function date_to_string(date: Date) {
	return [
		date.getFullYear(),
		`0${date.getMonth() + 1}`.slice(-2),
		`0${date.getDate()}`.slice(-2)
	].join("")
}

/**
 * Internal function to convert a YYYYMMDD-formatted string to a Date object
 * 
 * @param str Formatted string
 * @returns The Date object
 */
export function string_to_date(str: string) {
	if(str.length !== 8)
		throw new invalid_argument("Invalid date string");

	const date = new Date(
		`${
			str.substring(0, 4)
		}-${
			str.substring(4, 6)
		}-${
			str.substring(6)
		}`
	);

	if(isNaN(date.getTime()))
		throw new invalid_argument("Invalid date string");
	
	return date;
}

/**
 * Adds a specified amount of days from the given Date object
 * 
 * @param date Date object
 * @param days Number of days to add
 * @returns The resultant Date object
 */
export function add_days(date: Date, days: number) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}
