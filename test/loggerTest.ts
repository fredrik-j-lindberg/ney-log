"use strict";

import "mocha";
import { init, logInbound as log, reset as resetLogger } from "../src/logHandler";
import { ILogData } from "../src/LogData";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("logger tests", () => {
  afterEach(() => {
    resetLogger();
  });

  it("logDelegates are called once each", () => {
    const { logDelegates } = initAndLog();
    logDelegates.forEach((delegate) => {
      assert(delegate.calledOnce, `Log delegate was called ${delegate.callCount} instead of 1 times`);
    });
  });

  it("logDelegates are called with correct parameters", () => {
    const { logDelegates } = initAndLog();
    const propertiesToCheck = ["message", "level", "direction", "context", "timestamp"];
    const logData = logDelegates[0].getCall(0).args[0];

    propertiesToCheck.forEach((property) => {
      expect(logData).to.have.property(property);
      expect(logData[property], `Property '${property}'`).to.not.be.undefined;
    });
  });

  it("logDelegates with copies of logData can manupulate it without affecting eachother", () => {
    const { logDelegates, message } = initAndLog();
    const logData = logDelegates[0].getCall(0).args[0];

    expect(logData.message).to.equal(message);
  });

  it("changing logData values throws error (to prevent delegates from affecting eachother)", () => {
    let logDelegates = [
      sinon.stub().callsFake((logData) => {
        expect(() => logDelegateChangeMessage(logData)).to.throw(/.*read only.*/);
      }),
    ];
    initAndLog(logDelegates);

    logDelegates = [
      sinon.stub().callsFake((logData) => {
        expect(() => logDelegateChangeCallingClient(logData)).to.throw(/.*read only.*/);
      }),
    ];
    initAndLog(logDelegates);
  });
});

function initAndLog(logDelegates?: sinon.SinonStub<any[], any>[]) {
  logDelegates = logDelegates || [sinon.stub().callsFake(logDelegate), sinon.stub().callsFake(logDelegate)];
  init(logDelegates);
  const message = "Testing";
  log.error(message);
  return { logDelegates, message };
}

function logDelegate(logData: ILogData) {
  // Shallow copying through spread operators makes it possible to copy, but to change nested objects we need to shallow copy those as well.
  const test: any = { ...logData, context: { ...logData.context } };
  test.message = "123456";
  test.context.callingClient = "testclient";
}

function logDelegateChangeMessage(logData: any) {
  logData.message = "123456";
}

function logDelegateChangeCallingClient(logData: any) {
  logData.context.callingClient = "testclient";
}
