const Benchmark = require("benchmark");
const mlog = require("mocha-logger");
const { expect } = require("chai");
const memoizeFast = require("fast-memoize");
const memoizeOne = require("memoize-one");
const memoize1x0 = require("memoize-weak");
const memoize1x1 = require("../lib/memoize");

const mlogcycle = evt => {
  mlog.log(String(evt.target));
};

describe("memoize-weak v1.1 performance", () => {
  describe("GIVEN a memoized function that expects one object argument", () => {
    it("SHOULD return result faster than others", function() {
      this.timeout(60000);

      const arg = {
        id: 1,
        firstName: "Edd",
        lastName: "Nisen",
        email: "enisen0@google.nl",
        gender: "Male",
        ipAddress: "202.60.154.0"
      };
      const fn = u => `${u.firstName} ${u.lastName} (${u.email})`;
      const memoizedFast = memoizeFast(fn);
      const memoizedOne = memoizeOne(fn);
      const memoized1x0 = memoize1x0(fn);
      const memoized1x1 = memoize1x1(fn);

      memoizedFast(arg);
      memoizedOne(arg);
      memoized1x0(arg);
      memoized1x1(arg);

      const suite = new Benchmark.Suite();
      suite.add("fast-memoize v2.5", () => {
        for (let i = 0; i < 10000; i++) {
          memoizedFast(arg);
        }
      });
      suite.add("memoize-one v5.1", () => {
        for (let i = 0; i < 10000; i++) {
          memoizedOne(arg);
        }
      });
      suite.add("memoize-weak v1.0", () => {
        for (let i = 0; i < 10000; i++) {
          memoized1x0(arg);
        }
      });
      suite.add("memoize-weak v1.1", () => {
        for (let i = 0; i < 10000; i++) {
          memoized1x1(arg);
        }
      });
      suite.on("cycle", mlogcycle);
      suite.run();

      expect(suite.filter("fastest")[0].name).equal("memoize-weak v1.1");
    });
  });

  describe("GIVEN a memoized function that expects a single primitive argument", () => {
    it("SHOULD memoize faster than previous version", function() {
      this.timeout(20000);

      const suite = new Benchmark.Suite();
      suite.add("memoize-weak v1.0", () => {
        const memoized = memoize1x0(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i);
        }
      });
      suite.add("memoize-weak v1.1", () => {
        const memoized = memoize1x1(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i);
        }
      });
      suite.on("cycle", mlogcycle);
      suite.run();

      expect(suite.filter("fastest")[0].name).equal("memoize-weak v1.1");
    });

    it("SHOULD return result faster than previous version", function() {
      this.timeout(20000);

      const memoized1x0 = memoize1x0(x => x);
      const memoized1x1 = memoize1x1(x => x);
      for (let i = 0; i < 10000; i++) {
        memoized1x0(i);
        memoized1x1(i);
      }

      const suite = new Benchmark.Suite();
      suite.add("memoize-weak v1.0", () => {
        for (let i = 0; i < 10000; i++) {
          memoized1x0(i);
        }
      });
      suite.add("memoize-weak v1.1", () => {
        for (let i = 0; i < 10000; i++) {
          memoized1x1(i);
        }
      });
      suite.on("cycle", mlogcycle);
      suite.run();

      expect(suite.filter("fastest")[0].name).equal("memoize-weak v1.1");
    });
  });

  describe("GIVEN a memoized function that expects two primitive argument", () => {
    it("SHOULD memoize faster than previous version", function() {
      this.timeout(60000);

      const suite = new Benchmark.Suite();
      suite.add("memoize-weak v1.0", () => {
        const memoized = memoize1x0(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i, i + 1);
        }
      });
      suite.add("memoize-weak v1.1", () => {
        const memoized = memoize1x1(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i, i + 1);
        }
      });
      suite.on("cycle", mlogcycle);
      suite.run();

      expect(suite.filter("fastest")[0].name).equal("memoize-weak v1.1");
    });

    it("SHOULD return result faster than previous version", function() {
      this.timeout(60000);

      const memoized1x0 = memoize1x0(x => x);
      const memoized1x1 = memoize1x1(x => x);
      for (let i = 0; i < 10000; i++) {
        memoized1x0(i, i + 1);
        memoized1x1(i, i + 1);
      }

      const suite = new Benchmark.Suite();
      suite.add("memoize-weak v1.0", () => {
        for (let i = 0; i < 10000; i++) {
          memoized1x0(i, i + 1);
        }
      });
      suite.add("memoize-weak v1.1", () => {
        for (let i = 0; i < 10000; i++) {
          memoized1x1(i, i + 1);
        }
      });
      suite.on("cycle", mlogcycle);
      suite.run();

      expect(suite.filter("fastest")[0].name).equal("memoize-weak v1.1");
    });
  });
});
