'use strict';

const uuid = require('uuid');
const qs = require('querystring');
const route = require('./route');

// gateway
const gateway_url = process.env.GATEWAY_URL || 'http://127.0.0.1:3030';

// parameters fulfill methods
const fulfill = (query, mapping, params, cb) => {

	Object.keys(query)
	// .filter((e) => e != 'app_id')
	// .filter((e) => e != 'method')
	// .filter((e) => e != 'ver')
	// .filter((e) => e != 'sign')
	.map((e) => {
		let meta = mapping.mappingParameters[e];
		if (meta) {
			_fulfill(mapping.method, meta.type, meta.reference, query[e], meta.mediaType, params);
		} else {
			cb(e);
		}				
	});
};

const _fulfill = (method, type, key, val, media, params) => {
	switch(type) {
	case 'path':
		params.path = params.path.replace(new RegExp(`{${key}}`, "g"), val);
		break;
	case 'body':
		params.media = media;
		params.body = val;
		break;
	case 'header':
		params.headers[key] = val;
		break;
	case 'query':
		params.query[key] = val;
		break;
	default:
		// TODO?
		throw new Error('unkown type');
	}
};

module.exports = (req, config) => {

	let meta = route(Object.assign(Object.assign({/* new object */}, req.body), req.query), config);

	let params = {
		url: `${gateway_url}/${meta.service}`,
		path: meta.uri,
		media: null,
		headers: {},
		query: {},
		body: null
	};

	fulfill(req.query, meta, params, (e) => params.query[e] = req.query[e]);
	fulfill(req.body, meta, params, (e) => params.query[e] = req.body[e]);

	if (meta.defaultParameters) {
		Object.keys(meta.defaultParameters).map((e) => _fulfill(meta.method, 
																meta.defaultParameters[e].type, 
																e, 
																meta.defaultParameters[e].value, 
																meta.defaultParameters[e].mediaType,
																params));
	}

	params.headers['x-correlation-id'] = req.get('x-correlation-id') || uuid.v4();

	if (params.media) params.headers['Content-Type'] = params.media;

	params.url += params.path;

	if (Object.keys(params.query).length) {
		// fixed by daixy, 20180612, for GET request
		// if (params.body) {
		// fixed by daixy, 20181228, for request body handle regression
		// if (meta.method && meta.method.toUpperCase() == 'GET') {
		if (params.body || meta.method && meta.method.toUpperCase() == 'GET') {
			params.url += `?${qs.stringify(params.query)}`;
		} else {
			params.body = qs.stringify(params.query);
			params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}
	}

	console.log('[PARAM]');
	console.log(params);

	return params;
};