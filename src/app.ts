import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.port || 3000;

app.get(
	"/",
	(request: Request, response: Response) => {
		response.send('Hello World!');
	}
);

app.listen(
	port,
	() => {
		console.log(`Example app listening on port ${port}`);
	}
);
