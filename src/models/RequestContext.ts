import { requestContext } from "@neylion/request-context";
import { getTimestamp, getElapsedTime } from "../helpers";

class RequestContext {
  readonly correlationId?: string;
  readonly callingClient?: string;
  readonly method?: string;
  readonly path?: string;
  readonly startTimestamp?: string;
  readonly msSinceStart?: number;
  constructor() {
    this.correlationId = requestContext.correlationId;
    this.callingClient = requestContext.callingClient;
    this.method = requestContext.method;
    this.path = requestContext.path;
    this.startTimestamp = requestContext.startTime ? getTimestamp(requestContext.startTime) : undefined;
    this.msSinceStart = requestContext.startTime ? getElapsedTime(requestContext.startTime) : undefined;
  }
}

export { RequestContext };
