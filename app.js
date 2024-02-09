require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.port;

app.get(
	"/",
	(request, response) => {
		response.send('Hello World!');
	}
);

app.listen(
	port,
	() => {
		console.log(`Example app listening on port ${port}`);
	}
);
