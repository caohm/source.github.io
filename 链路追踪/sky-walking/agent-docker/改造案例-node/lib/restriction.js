'use strict';

module.exports = (req, res, next) => {
	if (req.method != 'GET' && req.method != 'POST') {
		console.log(`Method "${req.method}" NOT allowed.`);
		res.status(405).end();	// method not allowed
	} else {
		next();
	}
};