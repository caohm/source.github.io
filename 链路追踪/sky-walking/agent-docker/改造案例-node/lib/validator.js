'use strict';

module.exports = (req, res, next) => {

	req.assert('app_id').notEmpty();
	req.assert('method').notEmpty();
	req.assert('sign').len(32);

	let errors = req.validationErrors();

	if (errors) {
		console.log(errors.map((e) => `"${e.param}"`).reduce((p1, p2) => `${p1}, ${p2}`) + ' parameter(s) is missing.');
		res.status(400).end();	// parameter(s) missing
	} else {
		next();
	}
};