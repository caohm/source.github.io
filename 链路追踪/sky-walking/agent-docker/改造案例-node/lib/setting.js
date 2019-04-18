'use strict';

const node_module = require('cache-service-node-cache');
const redis_module = require('cache-service-redis');
const cache_service = require('cache-service');
const fetch = require('node-fetch');

// boss server
const boss_url = process.env.BOSS_URL || 'http://127.0.0.1:3030';

// cache constant
const cache_exp_l1 = process.env.CACHE_EXP_L1 || 60 * 1;		// 10 min 	-> refresh or not, (x) min expired, see `writeToVolatileCaches`
const bgref_exp_l1 = process.env.BGREF_EXP_L1 || 60 * 1;		// 1 min 	-> refresh every (x) min
const bgref_ttl_l1 = process.env.BGREF_TTL_L1 || 60 * 2;		// 2 min 	-> not refresh less than (x) min

const cache_exp_l2 = process.env.CACHE_EXP_L2 || 60 * 60 * 24; 	// 1 day	-> refresh or not, (x) min expired
const bgref_exp_l2 = process.env.BGREF_EXP_L2 || 60 * 10;		// 10 min 	-> refresh every (x) min
const bgref_ttl_l2 = process.env.BGREF_TTL_L2 || 60 * 15;		// 15 min 	-> not refresh less than (x) min

const config_cache_timeout = process.env.CONF_CACHE_TIMEOUT || 60 * 60 * 24; 	// 1 day

// redis server
const redis_host = process.env.REDIS_HOST || '127.0.0.1';
const redis_port = process.env.REDIS_PORT || 6379;

// create cache
const cache = new cache_service({verbose: false}, [
	
	new node_module({
		defaultExpiration: cache_exp_l1,
		backgroundRefreshInterval: bgref_exp_l1 * 1000,
		backgroundRefreshMinTtl: bgref_ttl_l1 * 1000,
		verbose: false
	}),

	new redis_module({
		defaultExpiration: cache_exp_l2,
		backgroundRefreshInterval: bgref_exp_l2 * 1000,
		backgroundRefreshMinTtl: bgref_ttl_l2 * 1000,
		redisData: {
			hostname: redis_host,
			port: redis_port
		},
		verbose: false
	})
]);

// cache wrapper method
const getx = (key, rb, cb) => {
	cache.get(key, (err, val) => {
		if(!err && val == null) {
			rb(key, (val) => {
				cache.set(key, val, config_cache_timeout, (key, func) => {
					rb(key, (val) => func(null, val));
				}, (err, success) => {
					if (err) {
						console.log(`Cache "${key}" failed.`);
						console.error(err);	// logging & ignore
					}
				});
				cb(null, val);
			});
		} else {
			cb(err, val);
		}
	});
};

module.exports = (url, cb, eh) => getx(url, (key, cb) => fetch(boss_url + key).then((res) => res.json()).then((json) => cb(json)).catch((err) => {
	console.log(`Fetch from '${boss_url}${key}' error.`);
	console.error(err);
	eh(err);
}), cb);