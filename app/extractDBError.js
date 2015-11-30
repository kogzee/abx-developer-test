/**
 * Extracts errors from mongoDB and Mongoose errors, transforms them into a single JSON format
 * @param  {Object} err Error from Mongoose or MongoDB
 * @return {Object}     Formatted error
 */
function getError( err ) {
	var msg = '', error = {};

	// Register of friendly error messages
	var errors = {
		11000: 'You already have that todo item in your list'
	};

	if( err && err.code ) {
		// MongoDB errors
		msg =(errors[err.code] || 'Unknown error');
		error = { 'code': 409, 'message': msg };
	} else  if( err && err.errors && typeof(err.errors)==='object' ) {
		// Mongoose errors
		for(var key in err.errors) {
			switch(err.errors[key].name) {
				case 'ValidatorError':
					error =  { 'code': 422, 'message': err.errors[key].message };
					break;
				// Add other error types here
				default:
					error = { 'code': 500, 'message': err.errors[key].message };
			}
		}
	} else {
		error = { 'code': 500, 'message': err.errors[key].message };
	}

	return error;
}

module.exports = getError;