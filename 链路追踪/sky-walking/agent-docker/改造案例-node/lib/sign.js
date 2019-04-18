'use strict';

const crypto = require('crypto');
const setting = require('./setting');

const sign = (params, secret) => {

	let params_str = secret + Object.keys(params)
		  			   			    .filter((e) => e != 'sign')
						   			.sort()
						   			.map((e) => e.concat(params[e]))
						   			.reduce((prev, curr) => prev + curr, '') + secret;

	return crypto.createHash("md5").update(new Buffer(params_str, 'utf-8')).digest('hex').toUpperCase();
};

module.exports = (req, res, next) => {

	let app_id = req.query.app_id || req.body.app_id;
	let app_sign = req.query.sign || req.body.sign;

	let url = `/api/v1/application/${app_id}`;

	setting(url, (err, val) => {
		if (err) {
			console.log(`Get meta data "${url}" failed.`);
			console.error(err);
			res.status(500).end();	// internal error
		} else {

			if (!val.enabled) {
				console.log(`Application "${app_id}" is disabled.`);
				console.log(val);
				res.status(403).end();	// resource forbidden
			} else {
				let s = sign(Object.assign(Object.assign({/* new object */}, req.body), req.query), val.appSecret);
				if (app_sign.toUpperCase() === s) {
					next();
				} else {
					console.log(`Signature "${app_sign}" NOT match "${s}".`);
					res.status(401).end();	// sign unmatched, try again
				}
			}
		}
	}, (err) => res.status(500).end());
};