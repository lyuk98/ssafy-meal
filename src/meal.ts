import dotenv from "dotenv";
import axios from "axios";
import { craft_request, get_meal_string, get_menus, request_type, response_type } from "./mapper";
import { string_to_date } from "./date";

dotenv.config();

/**
 * Instance to make requests
 */
const request_axios = axios.create(
	{
		"baseURL": "https://welplus.welstory.com/api",
		"method": "get",
		"headers": {
			"Cookie": `remember-me=${process.env.remember_me}${typeof process.env.jsessionid === "undefined" ? "" : `; JSESSIONID=${process.env.jsessionid}`}`,
			"User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
		}
	}
);

/**
 * Type for requesting detailed meal information
 */
interface detail_request_type {
	menuDt: any,
	hallNo: any,
	menuCourseType: any,
	menuMealType: any,
	restaurantCode: any,
	mainDivRestaurantCode: any
};

/**
 * Fetches meal information
 * 
 * @param request Request data
 * @returns Fetched data
 */
async function fetch_overview(request: request_type) {
	return (
		await request_axios.get(
			"meal",
			{ "params": request }
		)
	).data;
}

/**
 * Fetches individual meal information
 * 
 * @param request Request data
 * @returns Fetched data
 */
async function fetch_detail(request: detail_request_type) {
	return (
		await request_axios.get(
			"meal/detail",
			{ "params": request }
		)
	).data;
}

/**
 * Retrieves meal data based on the request
 * 
 * @param request 
 */
export async function fetch_meal(
	restaurant?: string, date?: string, meal?: string
): Promise<response_type> {
	// Craft request data and prepare menus to get
	const request = craft_request(restaurant, date, meal);
	const menus = get_menus(restaurant);

	// Fetch list of meals
	const overview = await fetch_overview(request);

	// Start crafting response
	let response = "";

	// Recreate Date from date
	{
		// Add current date and meal type as heading 1
		const d = string_to_date(request.menuDt);
		response += `# ${d.toLocaleString({ "dateStyle": "long" })} ${get_meal_string(request.menuMealType)}\n`;
	}

	// Loop through meals
	for(const meal of overview?.data?.mealList) {
		// Check if this menu is to be included
		if(Array.isArray(menus)) {
			if(!menus.includes(meal.menuCourseType))
				continue;
		}

		// Add menu and course name
		response += `\n## ${meal.menuName} (${meal.courseTxt})\n`;

		// Add menu image
		if(typeof meal?.photoUrl === "string" && typeof meal?.photoCd === "string") {
			const image_url = new URL(`${meal.photoUrl}${meal.photoCd}`);
			if(image_url.protocol === "http:")
				image_url.protocol = "https:";
			response += `\n![${meal.menuName}](${image_url})\n`;
		}

		// Fetch meal detail
		const detail = await fetch_detail(
			{
				menuDt: meal.menuDt,
				hallNo: meal.hallNo,
				menuCourseType: meal.menuCourseType,
				menuMealType: meal.menuMealType,
				restaurantCode: meal.restaurantCode,
				mainDivRestaurantCode: request.mainDivRestaurantCode
			}
		);

		// Add details
		if(Array.isArray(detail?.data)) {
			if(detail.data.length)
				response += "\n";

			for(const dish of detail.data) {
				response += "- ";
				if(dish?.soldOutYn === "Y")
					response += `~~${dish.menuName}~~`;
				else
					response += dish.menuName;
				response += "\n";
			}
		}
	}

	return {
		response_type: "in_channel",
		text: response
	};
}
