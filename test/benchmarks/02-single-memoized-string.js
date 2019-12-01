/* eslint-disable no-console */

const Benchmark = require("benchmark");
const memoizeFast = require("fast-memoize");
const memoizeOne = require("memoize-one");
const memoizeWeakPrev = require("memoize-weak");
const memoizeWeak = require("../../lib/memoize");

console.log("single memoized(string)");

const fn = s => s.toUpperCase();
const memoizedFast = memoizeFast(fn);
const memoizedOne = memoizeOne(fn);
const memoizedWeakPrev = memoizeWeakPrev(fn);
const memoizedWeak = memoizeWeak(fn);

const s = "a";
memoizedFast(s);
memoizedOne(s);
memoizedWeakPrev(s);
memoizedWeak(s);

const suite = new Benchmark.Suite();
suite.add("fast-memoize@2.5.1", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedFast(s);
  }
});
suite.add("memoize-one@5.1.1", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedOne(s);
  }
});
suite.add("memoize-weak@1.0.2", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedWeakPrev(s);
  }
});
suite.add("memoize-weak@1.1.0", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedWeak(s);
  }
});
suite.on("cycle", evt => console.log(`  ${evt.target}`));
suite.run();
