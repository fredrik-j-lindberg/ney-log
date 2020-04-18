"use strict";

import "mocha";
import { log, reset as resetLogger } from "../src/logHandler";
import { expect } from "chai";

describe("logger validation tests", () => {
  after(() => {
    resetLogger();
  });

  it("logging before init result in error", () => {
    expect(() => log.info("Test log")).to.throw();
  });
});
