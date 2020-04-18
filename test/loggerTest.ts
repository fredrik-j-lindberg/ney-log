"use strict";

import "mocha";
import { init, logInbound as log, reset as resetLogger } from "../src/logHandler";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("logger tests", () => {
  after(() => {
    resetLogger();
  })
  const logDelegates = [sinon.stub(), sinon.stub()];
  init(logDelegates);
  log.error("Testing");

  it("logDelegates are called once each", () => {
    logDelegates.forEach((delegate) => {
      assert(delegate.calledOnce, `Log delegate was called ${delegate.callCount} instead of 1 times`);
    });
  });

  it("logDelegates are called with correct parameters", () => {
    const propertiesToCheck = ["message", "level", "direction", "context", "timestamp"];
    const logData = logDelegates[0].getCall(0).args[0];

    propertiesToCheck.forEach((property) => {
      expect(logData).to.have.property(property);
      expect(logData[property], `Property '${property}'`).to.not.be.undefined;
    });
  });
});
