'use strict';

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var _Object$values;
var fs = require('fs');
var path = require('path');
var dayjs = require('dayjs');
var LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel[LogLevel["error"] = 0] = "error";
  LogLevel[LogLevel["warn"] = 1] = "warn";
  LogLevel[LogLevel["info"] = 2] = "info";
  LogLevel[LogLevel["verbose"] = 3] = "verbose";
  LogLevel[LogLevel["debug"] = 4] = "debug";
  LogLevel[LogLevel["silly"] = 5] = "silly";
  return LogLevel;
}(LogLevel || {});
var LogLevelString = (_Object$values = Object.values(LogLevel)) === null || _Object$values === void 0 ? void 0 : _Object$values.splice(0, 6);
var Logger = /*#__PURE__*/function () {
  function Logger(options) {
    _classCallCheck(this, Logger);
    this.logDir = options.logDir || './logs';
    this.logFilePath = path.join(this.logDir, options.logName);
    this.recordLevel = options.recordLevel || [LogLevel.error];
    this.consoleOutput = Boolean(options.console);
    this.mode = options.mode || defaultOptions.mode;
    this.reserveTime = options.reserveTime || defaultOptions.reserveTime;
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, {
        recursive: true
      });
    }
  }
  return _createClass(Logger, [{
    key: "log",
    value: function log(level, message) {
      var _this = this;
      var stackInfo = '';
      if (level === LogLevel.error) {
        stackInfo = new Error().stack + '\n';
      }
      var logString = "".concat(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'), " [").concat(LogLevel[level], "] ").concat(message, "\n").concat(stackInfo);
      if (this.recordLevel.includes(level)) {
        // 每一天一个全量日志文件、文件名为logName + 当前日期
        var today = dayjs().startOf('day');
        // 0: 全量日志 2: 全量+级别日志
        if ([0, 2].includes(this.mode)) {
          // 全量日志文件名
          var logFileName = "".concat(this.logFilePath, ".").concat(today.format('YYYY-MM-DD'), ".txt");
          this.addLog(logFileName, logString);
        }
        // 1: 级别日志 2: 全量+级别日志
        if ([1, 2].includes(this.mode)) {
          LogLevelString.forEach(function (_level) {
            if (level === LogLevel[_level]) {
              var _logFileName = "".concat(_this.logFilePath, ".").concat(_level, ".").concat(today.format('YYYY-MM-DD'), ".txt");
              _this.addLog(_logFileName, logString);
            }
          });
        }
      }
      if (this.consoleOutput) {
        console.log(logString);
      }
    }
  }, {
    key: "addLog",
    value: function addLog(logFileName, logString) {
      this.autoDeleteLog();
      if (!fs.existsSync(logFileName)) {
        fs.writeFileSync(logFileName, logString);
      } else {
        fs.appendFileSync(logFileName, logString);
      }
    }
  }, {
    key: "autoDeleteLog",
    value: function autoDeleteLog() {
      var _this2 = this;
      if (this.reserveTime === 0) {
        return;
      }
      var files = fs.readdirSync(this.logDir);
      files.forEach(function (file) {
        var filePath = path.join(_this2.logDir, file);
        var fileStat = fs.statSync(filePath);
        var fileBornTimeStamp = dayjs(fileStat.birthtime).valueOf();
        var currentTimeStamp = dayjs().valueOf();
        if (fileStat.isFile() && fileBornTimeStamp + 1000 * _this2.reserveTime < currentTimeStamp) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len = arguments.length, message = new Array(_len), _key = 0; _key < _len; _key++) {
        message[_key] = arguments[_key];
      }
      this.log(LogLevel.error, message.join(' '));
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, message = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        message[_key2] = arguments[_key2];
      }
      this.log(LogLevel.warn, message.join(' '));
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, message = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        message[_key3] = arguments[_key3];
      }
      this.log(LogLevel.info, message.join(' '));
    }
  }, {
    key: "verbose",
    value: function verbose() {
      for (var _len4 = arguments.length, message = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        message[_key4] = arguments[_key4];
      }
      this.log(LogLevel.verbose, message.join(' '));
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len5 = arguments.length, message = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        message[_key5] = arguments[_key5];
      }
      this.log(LogLevel.debug, message.join(' '));
    }
  }, {
    key: "silly",
    value: function silly() {
      for (var _len6 = arguments.length, message = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        message[_key6] = arguments[_key6];
      }
      this.log(LogLevel.silly, message.join(' '));
    }
  }]);
}();
var defaultOptions = {
  mode: 0,
  logName: 'log',
  recordLevel: [LogLevel.error, LogLevel.warn, LogLevel.info, LogLevel.verbose, LogLevel.debug, LogLevel.silly],
  logDir: './logs',
  reserveTime: 60 * 60 * 24 * 365,
  // 0 为永久保留
  console: true
};
function create() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mergedOptions = _objectSpread2(_objectSpread2({}, defaultOptions), options);
  return new Logger(mergedOptions);
}

exports.LogLevel = LogLevel;
exports.Logger = Logger;
exports.create = create;
exports.defaultOptions = defaultOptions;
