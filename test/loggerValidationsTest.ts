"use strict";

import "mocha";
import { log, reset as resetLogger } from "../src/logHandler";
import { expect } from "chai";

describe("logger validation tests", () => {
  after(() => {
    resetLogger();
  });

  // TODO: Change to test that logging before init results in console.error log.
  // it("logging before init result in error", async () => {
  //   let isRejected = false;
  //   await log.info("Test log").catch(() => {
  //     isRejected = true;
  //   })
  //   expect(isRejected).to.be.true;
  // });
});
