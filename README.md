

# nodejs-logs

<div align="center">
  <h1>nodejs-logs</h1>
  <strong>简单易用的nodejs日志工具</strong>
</div>
<br/>

## 安装
```bash
npm install nodejs-logs
```
## 日志输出展示
```js
2024/12/02 12:12:12.059 [error] message
2024/12/02 12:12:12.059 [warn] message
2024/12/02 12:12:12.059 [info] message
2024/12/02 12:12:12.059 [verbose] message
2024/12/02 12:12:12.059 [debug] message
2024/12/02 12:12:12.059 [silly] message
```

## 日志使用

```js
const nodeLog = require('nodejs-log');
const logger = nodeLog.create();

// 日志记录
logger.error('message');
logger.warn('message');
logger.info('message');

```

## 日志配置
### 配置项及默认值
```js
const nodeLog = require('nodejs-log');
// 此处展示的是默认配置项
const logger = nodeLog.create({
  // 日志模式  0 日志全部存放在一个文件中 1 日志按级别存放 2 全量和级别存放都存在
  mode: 0, 
  // app.txt app.error.txt, app.warn.txt, app.info.txt,
  logName: 'log',
  // 默认只记录error级别的日志
  recordLevel: [0], 
  // 日志文件目录, 默认为当前目录下的logs目录
  logDir: './logs',
  // 保留日志文件的时间 默认为0永远保留，单位秒
  reserveTime: 60 * 60 * 24 * 365,
  // 是否在控制台输出日志 默认为true, 请根据代码的环境来设置
  console: true
});
// 默认项可通过 nodeLog.defaultOptions 获取
```
### 日志等级
日志记录级别`recordLevel`符合RFC5424winston指定的严重性顺序 ：假设所有级别的严重性按数字顺序 从最重要到最不重要升序。
```
enum LogLevel {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}
```