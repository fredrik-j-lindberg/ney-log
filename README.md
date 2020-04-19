# ney-log
A logger package (built with backend APIs in mind) designed to handle logs and put together relevant metadata. The package itself does not actually log anywhere, but requires you to add delegate methods that it can call upon when a new log has been received.

## Adding to project
- Install: ``npm install @neylion/log``
- Initialize (before any calls to log): 
  - Importing: ``const { init } = require("@neylion/log");``
  - Initializing: ``init(logDelegates);``
- Log:
  - Importing: ``const { log } = require("@neylion/log");``
  - Logging: ``log.error("Message", errorObject, { metadata1: "Useful context", metadata2: "useful context" })``

## Log Levels
Level | Method | General guidelines when to use
------|--------|------------
fatal | log.fatal(...) | Something critical went wrong that is likely to warrent immediate attention.
error | log.error(...) | Unexpected error was encountered that is likely something you should look into fixing.
warn | log.warn(...) | | Something unexpected/suboptimal happened that is likely something you should look into but does not require immediate attention.
info | log.info(...) | Something happened that is likely to be good to know.
debug | log.debug(...) | Something happend that is likely not of much interest but good to know when debugging the application more thoroughly.

## Log Delegates
When initializing the logger, you are required to provide an array of methods (delegates) that will do the actual logging. These delegates will be called, when a new log has been processed, with all the data relevant to that specific log.

Here are two small examples on how you can set up your own log delegate method:
### Simply logging the whole logData object as json
```javascript
function consoleLogger(logData){
  console.log(logData);
}
```
### Logging message after customizing it
```javascript
function consoleLogger(logData){
  // Customize message the way you want it
  let message = `${logData.direction} ${logData.message} | CorrId: ${logData.correlationId}`;
  // Add direction if it exists
  message = logData.direction ? `${logData.direction} ${message}` : message;
  console.log(`${logData.level} ${message}`);
}
```
If you use typescript you can import the interface "ILogData" to be able to more easily handle the logData parameter. If using plain javascript, see the following section for a list of what the object contains

## Log Data
The packages processes a lot of useful information and makes them available to the log delegates through the parameter sent to them. Here are all the properties available on the object:

Property | Type | Explanation
---------|------|------------
level | string | Log level (see section about log levels)
direction | string *or* undefined | undefined when using the regular "log" object but is automatically set if you use the "logInbound" or "logOutbound" objects instead. Useful for being able to tell which logs that relate to the pipe in to the internal code, and which relate to the pipe between internal code and external calls.
message | string | The message passed to the log method.
logDetails | object | Object passed to log method containing useful context to the specific log entry null (guarded to make sure it always returns empty object even if it is omitted in log).
error | object *or* undefined | Error
timestamp | string | Timestamp of log in format: ``hh:mm:ss.sss``
requestContext | object | If you use the package [@neylion/request-context](https://github.com/Neylion/ney-request-context), useful request context is available on this object. See the following table for more details on this object.

### requestContext properties
Property | Type | Explanation
---------|------|------------
msSinceStart | number *or* undefined | Milliseconds since request start.
startTimestamp | string *or* undefined | Request start timestamp in format: ``hh:mm:ss.sss``
correlationId | string *or* undefined | [See explanation](https://github.com/Neylion/ney-request-context#request-context-properties)
callingClient | string *or* undefined | [See explanation](https://github.com/Neylion/ney-request-context#request-context-properties)
method | string *or* undefined | [See explanation](https://github.com/Neylion/ney-request-context#request-context-properties)
path | string *or* undefined | [See explanation](https://github.com/Neylion/ney-request-context#request-context-properties)


