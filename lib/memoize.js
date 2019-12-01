/* eslint-disable no-lonely-if */
/* eslint-disable no-multi-assign */
/* eslint-disable prefer-rest-params */

module.exports = function memoize(fn) {
  let root;
  let noargsCalled;
  let noargsResult;

  const reset = () => {
    root = {
      primitiveResults: null,
      referenceResults: null,
      primitiveArgs: null,
      referenceArgs: null
    };
    noargsCalled = false;
    noargsResult = undefined;
  };

  reset();

  const memoized = function memoized() {
    const last = arguments.length - 1;

    if (last === -1) {
      if (noargsCalled === false) {
        noargsResult = fn.call(this);
        noargsCalled = true;
      }
      return noargsResult;
    }

    let node = root;

    for (let i = 0; i < last; i += 1) {
      const arg = arguments[i];
      const primitive =
        arg === null || (typeof arg !== "object" && typeof arg !== "function");

      let argsMap;

      if (primitive) {
        if (node.primitiveArgs === null) {
          argsMap = node.primitiveArgs = new Map();
        } else {
          argsMap = node.primitiveArgs;
        }
      } else {
        if (node.referenceArgs === null) {
          argsMap = node.referenceArgs = new WeakMap();
        } else {
          argsMap = node.referenceArgs;
        }
      }

      if (argsMap.has(arg) === false) {
        node = {
          primitiveResults: null,
          referenceResults: null,
          primitiveArgs: null,
          referenceArgs: null
        };
        argsMap.set(arg, node);
      } else {
        node = argsMap.get(arg);
      }
    }

    let result;

    const arg = arguments[last];
    const primitive =
      arg === null || (typeof arg !== "object" && typeof arg !== "function");

    let resultsMap;

    if (primitive) {
      if (node.primitiveResults === null) {
        resultsMap = node.primitiveResults = new Map();
      } else {
        resultsMap = node.primitiveResults;
      }
    } else {
      if (node.referenceResults === null) {
        resultsMap = node.referenceResults = new WeakMap();
      } else {
        resultsMap = node.referenceResults;
      }
    }

    if (resultsMap.has(arg)) {
      result = resultsMap.get(arg);
    } else {
      result = fn.apply(this, arguments);
      resultsMap.set(arg, result);
    }

    return result;
  };

  memoized.clear = function clear() {
    const last = arguments.length - 1;
    if (last === -1) {
      reset();
      return;
    }

    let node = root;

    for (let i = 0; i < last; i += 1) {
      const arg = arguments[i];
      const primitive =
        arg === null || (typeof arg !== "object" && typeof arg !== "function");
      const argsMap = primitive ? node.primitiveArgs : node.referenceArgs;
      if (argsMap === null) {
        return;
      }
      node = argsMap.get(arg);
    }

    const arg = arguments[last];
    const primitive =
      arg === null || (typeof arg !== "object" && typeof arg !== "function");

    if (primitive) {
      if (node.primitiveArgs !== null) {
        node.primitiveArgs.delete(arg);
      }
      if (node.primitiveResults !== null) {
        node.primitiveResults.delete(arg);
      }
    } else {
      if (node.referenceArgs !== null) {
        node.referenceArgs.delete(arg);
      }
      if (node.referenceResults !== null) {
        node.referenceResults.delete(arg);
      }
    }
  };

  return memoized;
};
