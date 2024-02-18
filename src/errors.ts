/**
 * Base class for errors this project can throw
 */
export class http_error extends Error {
	constructor(message?: string) {
		super(message);
	}

	response_code() {
		return 500;
	}
}

/**
 * Error thrown upon receiving an invalid argument
 */
export class invalid_argument extends http_error {
	response_code() {
		return 400;
	}
}

/**
 * Error thrown upon receiving an invalid restaurant name
 */
export class invalid_restaurant extends invalid_argument {
	constructor() { super("Invalid restaurant"); }
}
/**
 * Error thrown upon receiving an invalid date
 */
export class invalid_date extends invalid_argument {
	constructor() { super("Invalid date"); }
}
/**
 * Error thrown upon receiving an invalid meal type
 */
export class invalid_meal extends invalid_argument {
	constructor() { super("Invalid meal type"); }
}
