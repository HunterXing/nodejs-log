const { create } = require('../src/index');

const logger = create({
  mode: 2,
  logDir: './logs',
  reserveTime: 60,
  recordLevel: [0,1,2,3,4,5],
  console: true,
});

const a = 1

logger.error('Hello, world!', a);
logger.info('Hello, world!');
logger.debug('Hello, world!');
logger.verbose('Hello, world!');
logger.warn('Hello, world!');
logger.silly('Hello, world!');
