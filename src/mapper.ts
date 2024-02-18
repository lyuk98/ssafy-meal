import { DateTime } from "luxon";
import { date_to_string } from "./date";
import { invalid_date, invalid_meal, invalid_restaurant } from "./errors";

/**
 * Type to represent a meal
 */
interface meal_type {
	[meal: string]: string
};

/**
 * Internal type to represent information of a restaurant
 */
interface restaurant_information {
	/** Restaurant code used for requests */
	restaurant_code: string,
	/** Menu codes used on response or undefined if all menus can be used */
	menus: readonly string[] | undefined
};

/**
 * Type to represent a restaurant
 */
interface restaurant_type {
	[restaurant: string]: restaurant_information
};

/**
 * Available meals of the day
 */
const meals: meal_type = {
	"breakfast": "1",
	"lunch": "2",
	"dinner": "3",
	"supper": "4"
	// TODO: find names for meal types 5 and 6
} as const;

/**
 * Available meals with their textual description
 */
const meal_string: {
	[meal: string]: string
} = {
	"1": "아침",
	"2": "점심",
	"3": "저녁",
	"4": "야식",
	"5": "간식",
	"6": "새벽식"
};

/**
 * Available restaurants and their information
 */
const restaurants: restaurant_type = {
	"buk": {
		restaurant_code: "REST000595",
		menus: ["AA", "BB", "CC", "DD", "EE"]
	},
	"seoul": {
		restaurant_code: "REST000133",
		menus: undefined
	}
} as const;

/**
 * Request type
 */
export interface request_type {
	restaurantCode: restaurant_information["restaurant_code"],
	menuMealType: meal_type["meal"],
	menuDt: string,
	sortingFlag: "basic",
	mainDivRestaurantCode: restaurant_information["restaurant_code"],
	activeRestaurantCode: restaurant_information["restaurant_code"]
};

/**
 * Creates a request to retrieve meal data
 * 
 * @param restaurant Restaurant name
 * @param date Date in YYYYMMDD format
 * @param meal Meal type
 * @returns Request
 */
export function craft_request(
	restaurant?: string,
	date?: string,
	meal?: string
): request_type {
	// Today in DateTime object
	const today = DateTime.now().setZone("Asia/Seoul").setLocale("ko-KR");

	// The date when the latest campus opened as minimum
	const minimum_date = "20210709";
	// One week after today as maximum
	const maximum_date = date_to_string(today.plus({ "days": 7 }).endOf("day"));

	// Default values for undefined parameters
	const default_restaurant = restaurants["buk"];
	const default_date = date_to_string(today);
	const default_meal = meals["lunch"];

	// Check for invalid restaurant
	if(
		typeof restaurant !== "undefined" &&
		!(restaurant in restaurants)
	) throw new invalid_restaurant();
	// Check for invalid meal type
	if(
		typeof meal !== "undefined" &&
		!(meal in meals)
	) throw new invalid_meal();
	// Check for invalid date string (part 1)
	if(
		typeof date !== "undefined" &&
		!(
			date.length === 8 &&
			minimum_date.localeCompare(date) <= 0 &&
			date.localeCompare(maximum_date) <= 0
		)
	) throw new invalid_date();
	// Check for invalid date string (part 2)
	else if(typeof date !== "undefined") {
		const year = date.substring(0, 4);
		const month = date.substring(4, 6);
		const day = date.substring(6);
		const check_date = new Date(`${year}-${month}-${day}`);

		// Check for invalid date strings, such as "20231343"
		if(isNaN(check_date.getTime()))
			throw new invalid_date();
	}

	// Set payload
	const restaurant_code = typeof restaurant !== "undefined" ?
		restaurants[restaurant].restaurant_code : default_restaurant.restaurant_code;
	const meal_type = typeof meal !== "undefined" ?
		meals[meal] : default_meal;

	// Craft request
	return {
		restaurantCode: restaurant_code,
		menuMealType: meal_type,
		menuDt: typeof date !== "undefined" ? date : default_date,
		sortingFlag: "basic",
		mainDivRestaurantCode: restaurant_code,
		activeRestaurantCode: restaurant_code
	};
}

/**
 * Returns menu codes of a specified restaurant
 * 
 * @param restaurant Restaurant
 * @returns List of menus or undefined
 */
export function get_menus(restaurant?: string) {
	if(typeof restaurant === "undefined")
		return restaurants["buk"].menus;
	if(!(restaurant in restaurants))
		throw new invalid_restaurant();
	
	return restaurants[restaurant].menus;
}

/**
 * Returns description of a meal type
 * 
 * @param meal Meal type
 * @returns Meal type description
 */
export function get_meal_string(meal?: string) {
	if(typeof meal === "undefined")
		return meal_string["lunch"];
	if(!(meal in meal_string))
		throw new invalid_meal();
	
	return meal_string[meal];
}

/**
 * Response type, meant to be compatible with Mattermost
 */
export interface response_type {
	response_type: "in_channel",
	text: string
};
