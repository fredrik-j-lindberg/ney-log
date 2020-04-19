"use strict";

import { EventEmitter } from "events";
import { EventHandler } from "./EventHandler";
import { requestContext } from "@neylion/request-context";
import { LogData } from "./LogData";

let initialized = false;
let eventHandler: EventHandler;
function init(delegates: (() => void)[], eventEmitter?: EventEmitter) {
  eventHandler = new EventHandler(delegates, eventEmitter);
  initialized = true;
}
function reset() {
  initialized = false;
}

function create(direction?: string) {
  const setupLogMethod = (level: string) => {
    return function emitLogEvent(message: string, logDetails?: object, error?: object) {
      if (!initialized) {
        throw new Error("Logger package not initiated, please call the init method before attempting to log.");
      }
      if (requestContext.skipLogging) return;
      const logData = new LogData(level, message, direction, logDetails, error);
      eventHandler.emitLogEvent(logData);
    };
  };

  return {
    fatal: setupLogMethod("fatal"),
    error: setupLogMethod("error"),
    warn: setupLogMethod("warn"),
    info: setupLogMethod("info"),
    debug: setupLogMethod("debug"),
  };
}

const log = create();
const logInbound = create("INBOUND");
const logOutbound = create("OUTBOUND");

export { init, log, logInbound, logOutbound, reset };
