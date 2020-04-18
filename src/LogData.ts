import { getTimestamp, getElapsedTime } from "./helpers";
import { requestContext } from "@neylion/request-context";

interface ILogData {
  message: string;
  level: string;
  direction?: string;
  context?: ILogDataContext;
  error?: object;
  timestamp: string;
  msSinceRequestStart?: number;
}

interface ILogDataContext {
  correlationId?: string;
  callingClient?: string;
  method?: string;
  path?: string;
  [key: string]: any;
}

class LogData implements ILogData {
  message: string;
  level: string;
  direction?: string;
  context?: object;
  error?: object;
  timestamp: string;
  msSinceRequestStart?: number;
  constructor(level: string, message: string, direction?: string, logDetails?: object, error?: object) {
    this.message = message;
    this.level = level;
    this.direction = direction;
    this.context = {
      ...requestContext.additionalData,
      ...logDetails,
      correlationId: requestContext.correlationId,
      callingClient: requestContext.callingClient,
      method: requestContext.method,
      path: requestContext.path,
    };
    this.error = error;
    this.timestamp = getTimestamp(new Date());
    this.msSinceRequestStart = getElapsedTime(requestContext.startTime);
  }
}

export { ILogData, LogData };
