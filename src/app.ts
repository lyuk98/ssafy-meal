import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { http_error } from "./errors";
import { fetch_meal } from "./meal";
import { response_type } from "./mapper";

dotenv.config();

const app = express();
const port = process.env.port || 3000;
const env = process.env.NODE_ENV || "development";

/**
 * Internal function to do common work of getting the meal data in Markdown
 * format
 * 
 * @param response The response object
 * @param restaurant Restaurant
 * @param date Date
 * @param meal Meal type
 */
async function get_meal(
	response: Response,
	restaurant?: string,
	date?: string,
	meal?: string
) {
	try {
		const data = await fetch_meal(restaurant, date, meal);

		response.contentType("text/markdown");
		response.send(data);
	}
	catch(error: any) {
		if(error instanceof http_error)
			response.status(error.response_code());
		else
			response.status(500);
		
		if(env === "development")
			response.send(error);
		else
			response.send();
	}
}

/**
 * Internal function to do common work of getting the meal data in
 * Mattermost-compatible format
 * 
 * @param response The response object
 * @param restaurant Restaurant
 * @param date Date
 * @param meal Meal type
 */
async function get_meal_mattermost(
	response: Response,
	restaurant?: string,
	date?: string,
	meal?: string
) {
	try {
		const data: response_type = {
			response_type: "in_channel",
			text: await fetch_meal(restaurant, date, meal)
		};

		response.contentType("application/json");
		response.send(data);
	}
	catch(error: any) {
		if(error instanceof http_error)
			response.status(error.response_code());
		else
			response.status(500);
		
		if(env === "development")
			response.send(error);
		else
			response.send();
	}
}

// GET /health-check
// Check health
app.get(
	"/health-check",
	(request: Request, response: Response) => {
		response.status(200);
		response.send();
	}
);

// GET /
// Retrieves today's lunch meal at BUK campus
// (because the author is there)
app.get(
	"/",
	(request: Request, response: Response) => {
		get_meal(response);
	}
);

// GET /mattermost
// Retrieves today's lunch meal at BUK campus
// in Mattermost-compatible format
app.get(
	"/mattermost",
	(request: Request, response: Response) => {
		get_meal_mattermost(response);
	}
);

// GET /:restaurant
// Retrieves today's lunch meal at the specified restaurant
app.get(
	"/:restaurant",
	(
		request: Request<{ restaurant: string }>,
		response: Response
	) => {
		const parameters = request.params;
		get_meal(
			response,
			parameters.restaurant
		);
	}
);

// GET /:restaurant/mattermost
// Retrieves today's lunch meal at the specified restaurant
// in Mattermost-compatible format
app.get(
	"/:restaurant/mattermost",
	(
		request: Request<{ restaurant: string }>,
		response: Response
	) => {
		const parameters = request.params;
		get_meal_mattermost(
			response,
			parameters.restaurant
		);
	}
);

// GET /:restaurant/:date
// Retrieves a specified day's lunch meal at the specified restaurant
app.get(
	"/:restaurant/:date",
	(
		request: Request<
			{
				restaurant: string,
				date: string
			}
		>,
		response: Response
	) => {
		const parameters = request.params;
		get_meal(
			response,
			parameters.restaurant,
			parameters.date
		);
	}
);

// GET /:restaurant/:date/mattermost
// Retrieves a specified day's lunch meal at the specified restaurant
// in Mattermost-compatible format
app.get(
	"/:restaurant/:date/mattermost",
	(
		request: Request<
			{
				restaurant: string,
				date: string
			}
		>,
		response: Response
	) => {
		const parameters = request.params;
		get_meal_mattermost(
			response,
			parameters.restaurant,
			parameters.date
		);
	}
);

// GET /:restaurant/:date/:meal
// Retrieves a specified day's specified meal at the specified restaurant
app.get(
	"/:restaurant/:date/:meal",
	(
		request: Request<
			{
				restaurant: string,
				date: string,
				meal: string
			}
		>,
		response: Response
	) => {
		const parameters = request.params;
		get_meal(
			response,
			parameters.restaurant,
			parameters.date,
			parameters.meal
		);
	}
);

// GET /:restaurant/:date/:meal
// Retrieves a specified day's specified meal at the specified restaurant
// in Mattermost-compatible format
app.get(
	"/:restaurant/:date/:meal/mattermost",
	(
		request: Request<
			{
				restaurant: string,
				date: string,
				meal: string
			}
		>,
		response: Response
	) => {
		const parameters = request.params;
		get_meal_mattermost(
			response,
			parameters.restaurant,
			parameters.date,
			parameters.meal
		);
	}
);

app.listen(
	port,
	() => {
		console.log(`App listening on port ${port}`);
	}
);
