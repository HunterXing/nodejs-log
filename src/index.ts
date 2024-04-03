const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs')

enum LogLevel {
  error,
  warn,
  info,
  verbose,
  debug,
  silly
}

const LogLevelString = Object.values(LogLevel)?.splice(0, 6)

interface LoggerOptions {
  mode: number;
  logName: string;
  recordLevel: number[];
  logDir?: string;
  reserveTime?: number;
  console?: boolean;
}

class Logger {
  private logFilePath: string;
  private recordLevel: number[];
  private consoleOutput: boolean;
  private logDir: string;
  private mode: number;
  private reserveTime: number;

  constructor(options: LoggerOptions) {
    this.logDir = options.logDir || './logs';
    this.logFilePath = path.join(this.logDir, options.logName);
    this.recordLevel = options.recordLevel || [LogLevel.error];
    this.consoleOutput = Boolean(options.console);
    this.mode = options.mode || defaultOptions.mode;
    this.reserveTime = (options.reserveTime || defaultOptions.reserveTime) as number;

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private log(level: LogLevel, message: string) {
    let stackInfo = ''
    if (level === LogLevel.error) {
      stackInfo = new Error().stack + '\n'
    }
    
    const logString = `${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')} [${LogLevel[level]}] ${message}\n${stackInfo}`;
    if (this.recordLevel.includes(level)) {
      // 每一天一个全量日志文件、文件名为logName + 当前日期
      const today = dayjs().startOf('day');
      // 0: 全量日志 2: 全量+级别日志
      if ([0,2].includes(this.mode)) {
        // 全量日志文件名
        const logFileName = `${this.logFilePath}.${today.format('YYYY-MM-DD')}.txt`;
        this.addLog(logFileName, logString)
      }
      // 1: 级别日志 2: 全量+级别日志
      if ([1,2].includes(this.mode)) {
        LogLevelString.forEach((_level) => {
          if (level === LogLevel[_level]) {
            const logFileName = `${this.logFilePath}.${_level}.${today.format('YYYY-MM-DD')}.txt`;
            this.addLog(logFileName, logString)
          }
        })
      }
    }

    if (this.consoleOutput) {
      console.log(logString);
    }
  }

  private addLog(logFileName, logString) {
    this.autoDeleteLog();
    if (!fs.existsSync(logFileName)) {
      fs.writeFileSync(logFileName, logString);
    } else {
      fs.appendFileSync(logFileName, logString);
    }
  }

  private autoDeleteLog() {
    if (this.reserveTime === 0) {
      return;
    }
    const files = fs.readdirSync(this.logDir);
    files.forEach((file) => {
      const filePath = path.join(this.logDir, file);
      const fileStat = fs.statSync(filePath);
      const fileBornTimeStamp = dayjs(fileStat.birthtime).valueOf()
      const currentTimeStamp = dayjs().valueOf()
      if (fileStat.isFile() && (fileBornTimeStamp + 1000 * this.reserveTime) < currentTimeStamp) {
        fs.unlinkSync(filePath);
      }
    });
  }

  error(message: string) {
    this.log(LogLevel.error, message);
  }

  warn(message: string) {
    this.log(LogLevel.warn, message);
  }

  info(message: string) {
    this.log(LogLevel.info, message);
  }

  verbose(message: string) {
    this.log(LogLevel.verbose, message);
  }

  debug(message: string) {
    this.log(LogLevel.debug, message);
  }

  silly(message: string) {
    this.log(LogLevel.silly, message);
  }
}

const defaultOptions: LoggerOptions = {
  mode: 0,
  logName: 'log',
  recordLevel: [LogLevel.error, LogLevel.warn, LogLevel.info, LogLevel.verbose, LogLevel.debug, LogLevel.silly],
  logDir: './logs',
  reserveTime: 60 * 60 * 24 * 365, // 0 为永久保留
  console: true
};

function create(options: Partial<LoggerOptions> = {}): Logger {
  const mergedOptions = { ...defaultOptions, ...options };
  return new Logger(mergedOptions);
}

export { LogLevel, Logger, create, defaultOptions };
