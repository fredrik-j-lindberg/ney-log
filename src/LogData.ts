import { getTimestamp, getElapsedTime } from "./helpers";
import { requestContext } from "@neylion/request-context";

interface ILogData {
  readonly message: string;
  readonly level: string;
  readonly direction?: string;
  readonly context?: ILogDataContext;
  readonly error?: object;
  readonly timestamp: string;
  readonly msSinceRequestStart?: number;
}

interface ILogDataContext {
  readonly correlationId?: string;
  readonly callingClient?: string;
  readonly method?: string;
  readonly path?: string;
  readonly [key: string]: any;
}

class LogData implements ILogData {
  message: string;
  level: string;
  direction?: string;
  context?: ILogDataContext;
  error?: object;
  timestamp: string;
  msSinceRequestStart?: number;
  constructor(level: string, message: string, direction?: string, logDetails?: object, error?: object) {
    this.message = message;
    this.level = level;
    this.direction = direction;
    this.context = {
      ...requestContext.additionalData,
      correlationId: requestContext.correlationId,
      callingClient: requestContext.callingClient,
      method: requestContext.method,
      path: requestContext.path,
      // Manually added log context added last to overwrite default values.
      ...logDetails,
    };
    this.error = error;
    this.timestamp = getTimestamp(new Date());
    this.msSinceRequestStart = getElapsedTime(requestContext.startTime);
  }
}

export { ILogData, LogData };
