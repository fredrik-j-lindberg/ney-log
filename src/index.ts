"use strict";

import { EventEmitter } from "events";
import { getTimestamp, getElapsedTime } from "./helpers";
import { requestContext } from "@neylion/request-context";

let initialized = false;
let em: EventEmitter;
export function init(delegates: (() => void)[], eventEmitter?: EventEmitter) {
  if (Object.keys(delegates).length <= 0) {
    throw new Error("Please provide at least one transform (log method to use).");
  }
  em = eventEmitter || new EventEmitter();
  addDelegates(delegates);
  initialized = true;
}

function addDelegates(delegates: (() => void)[]) {
  delegates.forEach((callback) => {
    if (typeof callback !== "function") {
      throw Error(`Transform delegate was '${typeof callback}' instead of function.`);
    }
    em.addListener("newLog", callback);
  });
}

enum Direction {
  Inbound = "INBOUND",
  Outbound = "OUTBOUND",
}

export const log = create();
export const logInbound = create(Direction.Inbound);
export const logOutbound = create(Direction.Outbound);

function create(direction?: Direction) {
  const setupLogMethod = (level: string) => {
    return function emitNewLog(message: string, logDetails?: object, errorObject?: object) {
      if (!initialized) {
        throw new Error("Logger package not initiated, please call the init method before attempting to log.");
      }
      if (requestContext.skipLogging) return;
      message = direction ? `${direction} ${message}` : message;
      const logData = assembleLogData(level, message, direction, logDetails, errorObject);
      em.emit("newLog", logData);
    };
  }

  return {
    fatal: setupLogMethod("fatal"),
    error: setupLogMethod("error"),
    warning: setupLogMethod("warning"),
    info: setupLogMethod("info"),
    debug: setupLogMethod("debug"),
  };
}

function assembleLogData(
  level: string,
  message: string,
  direction?: string,
  logDetails?: object,
  errorObject?: object,
) {
  const logData = {
    message,
    level,
    direction,
    context: {
      ...requestContext.additionalData,
      ...logDetails,
      correlationId: requestContext.correlationId,
      callingClient: requestContext.callingClient,
      path: requestContext.path,
    },
    error: errorObject,
    timeStamp: getTimestamp(new Date()),
    msSinceRequestStart: getElapsedTime(requestContext.startTime),
  };

  return logData;
}
