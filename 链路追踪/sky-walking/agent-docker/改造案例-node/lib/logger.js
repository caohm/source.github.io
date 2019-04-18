'use strict';

const dns = require('dns');
const amqp = require('amqplib/callback_api');
const morgan = require('morgan');

let amqp_host = process.env.AMQP_HOST || '127.0.0.1';
let amqp_port = process.env.AMQP_PORT || 5672;

const amqp_queue = process.env.AMQP_QUEUE || 'log';
const amqp_heartbeat = process.env.AMQP_HEARTBEAT * 1000 || 10 * 60 * 1000; // default 10 minutes

// export AMQP_SERVICE=rabbitmq.service.consul
const amqp_service = process.env.AMQP_SERVICE;

morgan.token('appId', (req) => {
  return req.query.app_id || req.body.app_id;
});

morgan.token('appMethod', (req) => {
  return req.query.method || req.body.method;
});

morgan.token('clientIP', (req) => {
  return req.get('x-real-ip') || req.get('x-forwarded-for') || req.hostname || req.ip;
});

let appender, intervalId;

function amqpConnect() {

	console.log(`connect to amqp://${amqp_host}:${amqp_port}...`);

	amqp.connect(`amqp://${amqp_host}:${amqp_port}`, (err, conn) => {

		if (err != null) {
			if (err.code != 'ECONNREFUSED') {
				console.error(err);
			} else {
				console.log(`Connect amqp://${amqp_host}:${amqp_port} failed.`);
			}
			if (!intervalId) {
				intervalId = setInterval(amqpConnect, amqp_heartbeat);
				console.log(`Start loop of amqp connection with ${amqp_heartbeat} ms.`);
			}			
			return;
		}

		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}

		conn.createChannel((err2, ch) => {

			if (err2 != null) {
				return console.error(err2);
			}

			ch.assertQueue(amqp_queue, {durable: false});
			appender = ch;

			console.log('amqp connected.');

			ch.on('error', (err3) => {
				console.error(`Channel ${amqp_queue} error!`, err3);
				appender = null;
			}).on('close', () => {
				console.log(`Channel ${amqp_queue} closed.`);
				appender = null;
			});
		});

		conn.on('error', (err4) => {
			console.error(`Connection amqp://${amqp_host}:${amqp_port} error!`, err4);
			appender = null;
		}).on('close', () => {
			console.log(`Connection amqp://${amqp_host}:${amqp_port} closed.`);
			appender = null;
			intervalId = setInterval(amqpConnect, amqp_heartbeat);
			console.log(`Start loop of amqp connection with ${amqp_heartbeat} ms.`);
		});
	});
}

if (amqp_service) {
	dns.resolveSrv(amqp_service, function(err, records) {
		if (err) {
			console.error(err);
		} else if (Array.isArray(records) && records.length > 0) {
			if (records[0].name) {
				amqp_host = records[0].name;
			}
			if (records[0].port) {
				amqp_port = records[0].port;
			}
		}
		amqpConnect();
	});
} else {
	amqpConnect();
}

const stream = {
	write: (msg) => {
		if (!appender) {
			console.log('[NO_QU] ', msg);
		} else {
			console.log('[QUEUE] ', msg);
			appender.sendToQueue(amqp_queue, Buffer.from(msg));
		}
	}
};

function createChannel(conn) {

	conn.createChannel((err, ch) => {

		if (err != null) {
			return console.error(err);
		}

		ch.assertQueue(amqp_queue, {durable: false});

		appender = ch;

		ch.on('close', () => {
			console.log('ch close');
			appender = null;
		});
	});	
}

module.exports = () => {
	return morgan('{"appId":":appId","method":":appMethod","clientIP":":clientIP","callTime":":date","responseTime"::response-time[0],"responseCode":":status","correlationID":":req[x-correlation-id]"}', {stream: stream});
};
