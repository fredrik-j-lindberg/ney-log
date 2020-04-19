import { getTimestamp } from "./helpers";
import { RequestContext } from "./RequestContext";

interface ILogData {
  readonly message: string;
  readonly level: string;
  readonly direction?: string;
  readonly logDetails: object;
  readonly error?: object;
  readonly timestamp: string;
  readonly requestContext: RequestContext;
}

class LogData implements ILogData {
  message: string;
  level: string;
  direction?: string;
  logDetails: object;
  error?: object;
  timestamp: string;
  requestContext: RequestContext;
  constructor(level: string, message: string, direction?: string, error?: object, logDetails?: object) {
    this.level = level;
    this.direction = direction;
    this.message = message;
    this.logDetails = logDetails || {};
    this.error = error;
    this.timestamp = getTimestamp(new Date());
    this.requestContext = new RequestContext();
  }
}

export { ILogData, LogData };
