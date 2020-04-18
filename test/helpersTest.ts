"use strict";

import "mocha";
import { getTimestamp, getElapsedTime } from "../src/helpers";
import { expect } from "chai";

describe("helperTests", () => {
  describe("getTimestamp works as expected", () => {
    // TODO: Create date manually to make sure padding is done correctly (08 minutes etc). Otherwise it could result in flaky tests
    const date = new Date();
    const timestamp = getTimestamp(date);
    const timestampArray = timestamp.split(/\:|\./);

    it("timestamp contains all parts", () => {
      expect(timestampArray).to.be.of.length(4, "timestamp length mismatch");
    });

    const [hours, minutes, seconds, milliseconds] = timestampArray;
    it("timestamp parts has the correct lengths (padded correctly)", () => {
      expect(hours).to.be.of.length(2, "hours length mismatch");
      expect(minutes).to.be.of.length(2, "minutes length mismatch");
      expect(seconds).to.be.of.length(2, "seconds length mismatch");
      expect(milliseconds).to.be.of.length(3, "milliseconds length mismatch");
    });

    it("timestamp parts has correct values", () => {
      expect(hours).to.include(date.getHours(), "hours value mismatch");
      expect(minutes).to.include(date.getMinutes(), "minutes value mismatch");
      expect(seconds).to.include(date.getSeconds(), "seconds value mismatch");
      expect(milliseconds).to.include(date.getMilliseconds(), "milliseconds value mismatch");
    });
  });

  describe("getElapsedTime works as expected", () => {
    it("returns value in ms", () => {
      const date = new Date();
      setTimeout(() => {
        const elapsedTime = getElapsedTime(date);
        expect(elapsedTime).to.be.a("number");
        expect(elapsedTime).to.be.greaterThan(5);
        expect(elapsedTime).to.be.lessThan(10);
      }, 5)
    });
    it("returns undefined if startTime value is not passed", () => {
      const elapsedTime = getElapsedTime(undefined);
      expect(elapsedTime).to.be.undefined;
    });
  });
});
