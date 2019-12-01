/* eslint-disable no-console */

const Benchmark = require("benchmark");
const memoizeFast = require("fast-memoize");
const memoizeOne = require("memoize-one");
const memoizeWeakPrev = require("memoize-weak");
const memoizeWeak = require("../../lib/memoize");

console.log("single memoized(object, number)");

const fn = (u, x) => `${u.firstName} ${u.lastName} ${u.age} [${x}]`;
const memoizedFast = memoizeFast(fn);
const memoizedOne = memoizeOne(fn);
const memoizedWeakPrev = memoizeWeakPrev(fn);
const memoizedWeak = memoizeWeak(fn);

const user = {
  firstName: "Edd",
  lastName: "Nisen",
  age: 42
};

memoizedFast(user, 1);
memoizedOne(user, 1);
memoizedWeakPrev(user, 1);
memoizedWeak(user, 1);

const suite = new Benchmark.Suite();
suite.add("fast-memoize@2.5.1", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedFast(user, 1);
  }
});
suite.add("memoize-one@5.1.1", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedOne(user, 1);
  }
});
suite.add("memoize-weak@1.0.2", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedWeakPrev(user, 1);
  }
});
suite.add("memoize-weak@1.1.0", () => {
  for (let i = 0; i < 10000; i += 1) {
    memoizedWeak(user, 1);
  }
});
suite.on("cycle", evt => console.log(`  ${evt.target}`));
suite.run();
