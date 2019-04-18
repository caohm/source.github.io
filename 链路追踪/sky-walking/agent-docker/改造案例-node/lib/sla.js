'use strict';

const ipaddr = require('ipaddr.js');
const redis = require('redis');

const setting = require('./setting');

// redis server
const redis_host = process.env.REDIS_HOST || '127.0.0.1';
const redis_port = process.env.REDIS_PORT || 6379;

// redis for counting
const client = redis.createClient({host:redis_host, port:redis_port});

// time unit to seconds
const tu2sec = (tu) => {
	switch(tu) {
	case 'SECONDS':
		return 1;
	case 'MINUTES':
		return 60;
	case 'HOURS':
		return 60 * 60;
	case 'DAYS':
		return 60 * 60 * 24;
	case 'MONTHS':
		return 60 * 60 * 24 * 30;
	case 'YEARS':
		return 60 * 60 * 24 * 365;
	}
};

module.exports = (req, res, next) => {

	let app_id = req.query.app_id || req.body.app_id;
	let app_method = req.query.method || req.body.method;

	let url = `/api/v1/sla/rule/${app_id}/${app_method}`;

	setting(url, (err, val) => {
		if (err) {
			console.log(`Get meta data "${url}" failed.`);
			console.error(err);
			res.status(500).end();	// internal error
		} else {

			if (!val.allow) {
				console.log(`Method "${app_method}" of application "${app_id}" is unallowable.`);
				console.log(val);
				res.status(403).end();	// resource forbidden
			} else {
				let trusted = false;

				let client_ip = ipaddr.IPv6.isValid(req.ip) && ipaddr.parse(req.ip).isIPv4MappedAddress() ? ipaddr.parse(req.ip).toIPv4Address().toString() : req.ip;

				val.clientIPs.map((mask) => {
					if (mask === '0.0.0.0') {
						trusted = true;
					} else if (client_ip === mask) {
						trusted = true;
					} else if (ipaddr.IPv4.isValid(client_ip) && mask.indexOf('/') > -1) {
						trusted = ipaddr.parse(client_ip).match(ipaddr.parseCIDR(mask));
					}
				});

				if (!trusted) {
					console.log(`IP "${client_ip}" NOT in whitelist.`);
					console.log(val);
					res.status(403).end();
				} else {
					let rule = val.trafficRule;
					if (rule) {	// traffic control
						let key = `${app_id}${rule.ruleId}`;
						client.get(key, (err, val) => {
							if (val === null) {		// first time or expired
								client.setex(key, tu2sec(rule.timeUnit), 1);
								next();
							} else if (val > rule.maxCalls) {
								console.log('Rate limit exceeded.');
								console.log(rule);
								res.status(429).end();	// too many requests
							} else {
								client.incr(key);
								next();
							}
						});
					} else {
						next();
					}
				}
			}
		}		
	}, (err) => res.status(500).end());
};