import { EventEmitter } from "events";
import { ILogData } from "./LogData";

class EventHandler {
  eventEmitter: EventEmitter;
  eventName: string = "newLog";
  constructor(delegates: (() => void)[], eventEmitter?: EventEmitter) {
    this.eventEmitter = eventEmitter || new EventEmitter();
    addListeners(this, delegates);
  }
  public addListener(listener: () => void) {
    this.eventEmitter.addListener(this.eventName, listener);
  }
  public emitLogEvent(logData: ILogData) {
    this.eventEmitter.emit(this.eventName, logData);
  }
}

function addListeners(eventHandler: EventHandler, delegates: (() => void)[]) {
  if (Object.keys(delegates).length <= 0) {
    throw new Error("Please provide at least one delegate (log method to use).");
  }
  delegates.forEach((delegate) => {
    if (typeof delegate !== "function") {
      throw Error(`Transform delegate was '${typeof delegate}' instead of function.`);
    }
    eventHandler.addListener(delegate);
  });
}

export { EventHandler };
