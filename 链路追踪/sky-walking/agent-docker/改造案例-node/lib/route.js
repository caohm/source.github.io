'use strict';

const qs = require('querystring');

module.exports = (params, meta) => {

	if (!meta.mappingCatalogues || meta.mappingCatalogues.length == 0) {
		return meta;
	}

	meta.mappingCatalogues.forEach((x) => {
		const cond = qs.parse(x.condition);
		const keys = Object.keys(cond);
		if (keys.filter((k) => params[k] == cond[k]).length == keys.length) {
			meta.service = x.service;
			meta.method = x.method ? x.method : meta.method;
			meta.uri = x.uri ? x.uri : meta.uri;
		}
	});

	console.log('[CONFG]');
	console.log(meta);

	return meta;
};