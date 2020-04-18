"use strict";

import { EventEmitter } from "events";
import { requestContext } from "@neylion/request-context";
import { LogData } from "./LogData";

let initialized = false;
let em: EventEmitter;
function init(delegates: (() => void)[], eventEmitter?: EventEmitter) {
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

const log = create();
const logInbound = create(Direction.Inbound);
const logOutbound = create(Direction.Outbound);

function create(direction?: Direction) {
  const setupLogMethod = (level: string) => {
    return function emitNewLog(message: string, logDetails?: object, error?: object) {
      if (!initialized) {
        throw new Error("Logger package not initiated, please call the init method before attempting to log.");
      }
      if (requestContext.skipLogging) return;
      message = direction ? `${direction} ${message}` : message;
      const logData = new LogData(level, message, direction, logDetails, error);
      em.emit("newLog", logData);
    };
  };

  return {
    fatal: setupLogMethod("fatal"),
    error: setupLogMethod("error"),
    warning: setupLogMethod("warning"),
    info: setupLogMethod("info"),
    debug: setupLogMethod("debug"),
  };
}

function reset() {
  initialized = false;
}

export { init, log, logInbound, logOutbound, reset };
