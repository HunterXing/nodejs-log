const { create } = require('../src/index');

const logger = create({
  mode: 2,
  logDir: './logs2',
  reserveTime: 60,
  recordLevel: [0,1,2,3,4,5],
  console: true,
});

logger.error('Hello, world!');
logger.info('Hello, world!');
logger.debug('Hello, world!');
logger.verbose('Hello, world!');
logger.warn('Hello, world!');
logger.silly('Hello, world!');
