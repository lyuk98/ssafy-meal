import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { http_error } from "./errors";
import { fetch_meal } from "./meal";

dotenv.config();

const app = express();
const port = process.env.port || 3000;
const env = process.env.NODE_ENV || "development";

/**
 * Internal function to do common work of retrieving the meal data
 * 
 * @param response The response object
 * @param restaurant Restaurant
 * @param date Date
 * @param meal Meal type
 */
async function retrieve_meal(response: Response, restaurant?: string, date?: string, meal?: string) {
	try {
		const data = await fetch_meal(restaurant, date, meal);

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
		retrieve_meal(response);
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
		retrieve_meal(
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
		retrieve_meal(
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
		retrieve_meal(
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
