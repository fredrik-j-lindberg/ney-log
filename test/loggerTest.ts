"use strict";

import "mocha";
import { init, logInbound as log, reset as resetLogger } from "../src/logHandler";
import { ILogData } from "../src/LogData";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("logger tests", () => {
  const getLogDelegateStub = () => {
    return sinon.stub().callsFake(logDelegate);
  };

  afterEach(() => {
    resetLogger();
  });

  it("logDelegates are called once each", () => {
    const logDelegates = [getLogDelegateStub(), getLogDelegateStub()];
    init(logDelegates);
    log.error("Testing");
    expectCalledOnce(logDelegates);
  });

  it("logDelegates are called with correct parameters", () => {
    const logDelegates = [getLogDelegateStub(), getLogDelegateStub()];
    init(logDelegates);
    log.error("Testing", new Error("Testing error"));
    const propertiesToCheck = ["message", "level", "direction", "context", "timestamp", "error"];
    expectCalledOnce(logDelegates);
    const logData = logDelegates[0].getCall(0).args[0];

    propertiesToCheck.forEach((property) => {
      expect(logData).to.have.property(property);
      expect(logData[property], `Property '${property}'`).to.not.be.undefined;
    });
    expect(logData.error).to.have.property("message");
  });

  it("logDelegates with copies of logData can manupulate it without affecting eachother", () => {
    const logDelegates = [getLogDelegateStub(), getLogDelegateStub()];
    init(logDelegates);
    const message = "Testing";
    log.error(message);
    const logData = logDelegates[0].getCall(0).args[0];
    expectCalledOnce(logDelegates);

    expect(logData.message).to.equal(message);
  });

  it("changing logData values throws error (to prevent delegates from affecting eachother)", () => {
    const logDelegates = [
      sinon.stub().callsFake((logData) => {
        expect(() => logDelegateChangeMessage(logData)).to.throw(/.*read only.*/);
      }),
      sinon.stub().callsFake((logData) => {
        expect(() => logDelegateChangeCallingClient(logData)).to.throw(/.*read only.*/);
      }),
    ];
    init(logDelegates);
    log.error("Testing");
    expectCalledOnce(logDelegates);
  });

  it("manually set context properties is prioritized", () => {
    const logDelegates = [getLogDelegateStub(), getLogDelegateStub()];
    init(logDelegates);
    const callingClient = "CallingClient";
    log.info("Testing", undefined, { callingClient });
    expectCalledOnce(logDelegates);
    const logData = logDelegates[0].getCall(0).args[0];

    expect(logData.context.callingClient).to.equal(callingClient);
  });
});

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

function expectCalledOnce(logDelegates: sinon.SinonStub<any[], any>[]) {
  logDelegates.forEach((delegate) => {
    assert(delegate.calledOnce, `Log delegate was called ${delegate.callCount} instead of 1 times`);
  });
}
