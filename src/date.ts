import { DateTime } from "luxon";
import { invalid_argument } from "./errors";

/**
 * Internal function to convert a Date object to YYYYMMDD-formatted string
 * 
 * @param date The DateTime object
 * @returns Formatted string
 */
export function date_to_string(date: DateTime<true> | DateTime<false>) {
	return date.toFormat("yyyyLLdd");
}

/**
 * Internal function to convert a YYYYMMDD-formatted string to a Date object
 * 
 * @param str Formatted string
 * @returns The DateTime object
 */
export function string_to_date(str: string) {
	const date = DateTime.fromFormat(str, "yyyyLLdd").setLocale("ko-KR");

	if(!date.isValid)
		throw new invalid_argument("Invalid date string");
	
	return date;
}
