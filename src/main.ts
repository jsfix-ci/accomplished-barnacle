#!/usr/bin/env node

import { Logger } from 'sitka';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {name: 'accomplished-barnacle',level: Logger.Level.ALL};
const logger = Logger.getLogger(loggerConfig);
logger.info('started');

const argv = require('minimist')(process.argv.slice(2));
console.log(argv);