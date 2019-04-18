'use strict';

const os = require('os');

module.exports = {

	health: () => {

		return {status: 'UP'};
	},
	
	metrics: () => {

		let metrics = {
			mem: Math.round(os.totalmem()/1000),
			processors: os.cpus().length,
			uptime: Math.round(os.uptime()*1000)
		};

		metrics['mem.free'] = Math.round(os.freemem()/1000);
		metrics['instance.uptime'] = Math.round(process.uptime()*1000);
		metrics['systemload.average'] = parseFloat((os.loadavg()[2]/os.cpus().length).toFixed(2));
		metrics['heap.committed'] = Math.round(process.memoryUsage().rss/1000);
		metrics['heap.init'] = Math.round(process.memoryUsage().heapTotal/1000);
		metrics['heap.used'] = Math.round(process.memoryUsage().heapUsed/1000);

		return metrics;
	},
	
	env: () => {
		return {systemEnvironment: process.env};
	}
};