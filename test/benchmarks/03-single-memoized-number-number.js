/* eslint-disable no-console */

const Benchmark = require("benchmark");
const memoizeFast = require("fast-memoize");
const memoizeOne = require("memoize-one");
const memoizeWeakPrev = require("memoize-weak");
const memoizeWeak = require("../../lib/memoize");

console.log("single memoized(number, number)");

const fn = (x, y) => x * y;
const memoizedFast = memoizeFast(fn);
const memoizedOne = memoizeOne(fn);
const memoizedWeakPrev = memoizeWeakPrev(fn);
const memoizedWeak = memoizeWeak(fn);

memoizedFast(2, 3);
memoizedOne(2, 3);
memoizedWeakPrev(2, 3);
memoizedWeak(2, 3);

const suite = new Benchmark.Suite();
suite.add("fast-memoize@2.5.1", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedFast(2, 3);
  }
});
suite.add("memoize-one@5.1.1", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedOne(2, 3);
  }
});
suite.add("memoize-weak@1.0.2", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedWeakPrev(2, 3);
  }
});
suite.add("memoize-weak@1.1.0", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedWeak(2, 3);
  }
});
suite.on("cycle", evt => console.log(`  ${evt.target}`));
suite.run();
