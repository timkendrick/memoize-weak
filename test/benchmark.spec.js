const Benchmark = require("benchmark");
const mlog = require("mocha-logger");
const { expect } = require("chai");
const prevMemoize = require("memoize-weak");
const nextMemoize = require("../lib/memoize");

describe("memoize performance", () => {
  describe("GIVEN a memoized function that expects a single primitive argument", () => {
    it("SHOULD memoize faster than previous version", function() {
      this.timeout(20000);

      const suite = new Benchmark.Suite();
      suite.add("prev", () => {
        const memoized = prevMemoize(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i);
        }
      });
      suite.add("next", () => {
        const memoized = nextMemoize(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i);
        }
      });
      suite.on("cycle", evt => {
        mlog.log(String(evt.target));
      });
      suite.run();

      expect(suite.filter("fastest").map("name")[0]).to.equal("next");
    });

    it("SHOULD return results faster than previous version", function() {
      this.timeout(20000);

      const prevMemoized = prevMemoize(x => x);
      const nextMemoized = nextMemoize(x => x);
      for (let i = 0; i < 10000; i++) {
        prevMemoized(i);
        nextMemoized(i);
      }

      const suite = new Benchmark.Suite();
      suite.add("prev", () => {
        for (let i = 0; i < 10000; i++) {
          prevMemoized(i);
        }
      });
      suite.add("next", () => {
        for (let i = 0; i < 10000; i++) {
          nextMemoized(i);
        }
      });
      suite.on("cycle", evt => {
        mlog.log(String(evt.target));
      });
      suite.run();

      expect(suite.filter("fastest").map("name")[0]).to.equal("next");
    });
  });

  describe("GIVEN a memoized function that expects two primitive argument", () => {
    it("SHOULD memoize faster than previous version", function() {
      this.timeout(20000);

      const suite = new Benchmark.Suite();
      suite.add("prev", () => {
        const memoized = prevMemoize(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i, i + 1);
        }
      });
      suite.add("next", () => {
        const memoized = nextMemoize(() => {});
        for (let i = 0; i < 10000; i++) {
          memoized(i, i + 1);
        }
      });
      suite.on("cycle", evt => {
        mlog.log(String(evt.target));
      });
      suite.run();

      expect(suite.filter("fastest").map("name")[0]).to.equal("next");
    });

    it("SHOULD return results faster than previous version", function() {
      this.timeout(15000);

      const prevMemoized = prevMemoize(x => x);
      const nextMemoized = nextMemoize(x => x);
      for (let i = 0; i < 10000; i++) {
        prevMemoized(i, i + 1);
        nextMemoized(i, i + 1);
      }

      const suite = new Benchmark.Suite();
      suite.add("prev", () => {
        for (let i = 0; i < 10000; i++) {
          prevMemoized(i, i + 1);
        }
      });
      suite.add("next", () => {
        for (let i = 0; i < 10000; i++) {
          nextMemoized(i, i + 1);
        }
      });
      suite.on("cycle", evt => {
        mlog.log(String(evt.target));
      });
      suite.run();

      expect(suite.filter("fastest").map("name")[0]).to.equal("next");
    });
  });
});
