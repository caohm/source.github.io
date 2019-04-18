'use strict';

require("skyapm-nodejs").start({
    serviceName: process.env.SW_AGENT_NAME || "ngopen-opgw",
    directServers: process.env.SW_AGENT_COLLECTOR_BACKEND_SERVICES || '127.0.0.1:11800'
});

const util = require('util');

const express = require('express');
const favicon = require('serve-favicon');
const auth = require('http-auth');
const bp = require('body-parser');
const cp = require('cookie-parser');
const ev = require('express-validator');
const fetch = require('node-fetch');

const metrics = require('./lib/metrics');
const restriction = require('./lib/restriction');
const validator = require('./lib/validator');
const sign = require('./lib/sign');
const sla = require('./lib/sla');
const logger = require('./lib/logger');
const preprocess = require('./lib/preprocess');
const get = require('./lib/setting');
const transform = require('./lib/transform');

// port
const port = process.env.PORT0 || 3000;

// express
const app = express();

app.set('x-powered-by', false);

// dummy favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// health
app.get('/health', (req, res) => res.json(metrics.health()));

// http basic auth
const basic = auth.basic({
	realm: 'Open API Gateway',
	file: __dirname + '/etc/.htpasswd'
});

// metrics
app.get('/metrics', auth.connect(basic), (req, res) => res.json(metrics.metrics()));
app.get('/env', auth.connect(basic), (req, res) => res.json(metrics.env()));

// restriction
app.use(restriction);

// parse request body
app.use(bp.urlencoded({extended: false}));

// parse cookies
app.use(cp());

// validator
app.use(ev());

// check paramters
app.use(validator);

// check sign
app.use(sign);

// check SLA
app.use(sla);

// pre-processing
app.use(preprocess);

// logging
app.use(logger());

// main process
app.all('*', (req, res) => {

	// debug request
	try {
		console.log(`[REQST] ${req.method} ${req.hostname}(${req.ip}) ${req.originalUrl}`);
		console.log('[REQ_H] ', req.headers);
		console.log('[REQ_Q] ',req.query);
		console.log('[REQ_B] ',req.body);
	} catch (err) {
		console.error(err);
	}

	let app_method = req.query.method || req.body.method;
	let ver = req.query.ver || req.body.ver;

	let url = ver ? `/api/v1/openapi/mapping/${app_method}/${ver}` : `/api/v1/openapi/mapping/${app_method}`;

	// get parameter transfer rules
	get(url, (err, val) => {

		let params = transform(req, val);

		fetch(params.url, {
			method: val.method,
			headers: params.headers,
			body: params.body || ''
		}).then(response => {

			// debug response
			try {
				console.log('[RESPS] ', response.ok, response.status, response.statusText, response.url);
				console.log('[RES_B] ', JSON.stringify(response.body._readableState.buffer.head, function(k, v) {
					try {
						if (k == 'data' && Array.isArray(v)) {
							return Buffer.from(v).toString();
						}
					} catch (err) {
						console.error(err);
					}
					return v;
				}));
			} catch (err2) {
				console.error(err2);
			}
			let headers = response.headers.raw() || {};
			Object.keys(response.headers.raw()).forEach(function(key) {
				if (Array.isArray(headers[key])) {
					headers[key] = headers[key].join('');
				}
			});
			console.log('[RES_H] ', headers);
			res.set(headers);
			res.status(response.status);
			response.body.pipe(res);

			// TODO LOG

		}).catch(ex => {
			console.log(`Call ${params.url} failed.`);
			console.error(ex);
			res.status(503).end();
		});

	}, (err) => res.status(500).end());
});

app.listen(port, () => console.log(`Open API Gateway listening on port ${port}...`));