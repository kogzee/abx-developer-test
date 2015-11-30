'use strict';
/**
 * Extracts errors from mongoDB and Mongoose errors, transforms them into a single JSON format
 * @param  {Object} err Error from Mongoose or MongoDB
 * @return {Object}     Formatted error
 */
function getError( err, info ) {
	var msg = '', error = {};
	// Register of friendly error messages
	var errors = {
		11000: '\'%s\' is already in the Todo list'
	};

	info = info || '';

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
		error = { 'code': 500, 'message': 'Unknown error' };
	}

	// replace %s, with message
	error.message = error.message.replace('%s', info); // This wll be handdled by ES6 soon

	return error;
}

module.exports = getError;