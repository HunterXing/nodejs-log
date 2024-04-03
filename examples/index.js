const { create } = require('../dist/build.min');

const logger = create({});

logger.error('Hello, world!');
logger.info('Hello, world!');
logger.debug('Hello, world!');
logger.verbose('Hello, world!');
logger.warn('Hello, world!');
logger.silly('Hello, world!');
