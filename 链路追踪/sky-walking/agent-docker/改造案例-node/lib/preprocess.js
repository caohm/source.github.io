'use strict';

const uuid = require('uuid');

module.exports = (req, res, next) => {

	// attach correlation id
	if (!req.get('x-correlation-id')) req.headers['x-correlation-id'] = uuid.v4();

	next();
};