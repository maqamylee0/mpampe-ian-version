const winston = require('winston');
const fs = require('fs');

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new winston.transports.File({
			level: 'info',
			filename: logDir + '/logs.log',
			handleExceptions: true,
			json: true,
			maxsize: 5242880,
			maxFiles: 5,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.align(),
				winston.format.printf((info) => {
					const { timestamp, level, message, ...args } = info;

					const ts = timestamp.slice(0, 19).replace('T', ' ');
					return `${ts} [${level}]: ${message} ${
						Object.keys(args).length
							? JSON.stringify(args, null, 2)
							: ''
					}`;
				})
			),
		}),
	],
	exitOnError: false,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				winston.format.align(),
				winston.format.printf((debug) => {
					const { timestamp, level, message, ...args } = debug;

					const ts = timestamp.slice(0, 19).replace('T', ' ');
					return `${ts} [${level}]: ${message} ${
						Object.keys(args).length
							? JSON.stringify(args, null, 2)
							: ''
					}`;
				})
			),
		})
	);
}
module.exports = {
    logger,
    stream :{
	write: (message, encoding) => {
		logger.info(message);
	},
}}



// const chalk = require("chalk");

// let LOG_TYPES = {
//   NONE: 0,
//   ERROR: 1,
//   NORMAL: 2,
//   DEBUG: 3,
// };

// let logType = LOG_TYPES.DEBUG;

// const setLogType = (type) => {
//   if (typeof type !== "number") return;

//   logType = type;
// };

// const logTime = () => {
//   let nowDate = new Date();
//   return (
//     nowDate.toLocaleDateString() +
//     " " +
//     nowDate.toLocaleTimeString([], { hour12: false })
//   );
// };

// const log = (...args) => {
//   if (logType < LOG_TYPES.NORMAL) return;

//   console.log(logTime(), process.pid, chalk.bold.green("[INFO]"), ...args);
// };

// const error = (...args) => {
//   if (logType < LOG_TYPES.ERROR) return;

//   console.log(logTime(), process.pid, chalk.bold.red("[ERROR]"), ...args);
// };

// const debug = (...args) => {
//   if (logType < LOG_TYPES.DEBUG) return;

//   console.log(logTime(), process.pid, chalk.bold.blue("[DEBUG]"), ...args);
// };

// if (process.env.NODE_ENV !== "production") {
//   setLogType(3);
// }

// module.exports = {
//   LOG_TYPES,
//   setLogType,
//   log,
//   error,
//   debug,
// };
