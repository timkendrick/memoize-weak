module.exports = function memoize(fn) {
  let root;
  let zeroArgsCalled;
  let zeroArgsResult;

  const reset = () => {
    root = {
      primitiveResults: null,
      referenceResults: null,
      primitiveArgs: null,
      referenceArgs: null
    };
    zeroArgsCalled = false;
    zeroArgsResult = undefined;
  };

  reset();

  const memoized = function memoized() {
    if (arguments.length === 0) {
      if (zeroArgsCalled === false) {
        zeroArgsResult = fn.call(this);
        zeroArgsCalled = true;
      }
      return zeroArgsResult;
    }

    let node = root;
    let result;

    for (let i = 0, l = arguments.length; i < l; i++) {
      const arg = arguments[i];
      const primitive =
        arg === null || (typeof arg !== "object" && typeof arg !== "function");

      if (i === arguments.length - 1) {
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

        if (resultsMap.has(arg) === false) {
          result = fn.apply(this, arguments);
          resultsMap.set(arg, result);
        } else {
          result = resultsMap.get(arg);
        }
      } else {
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
    }

    return result;
  };

  memoized.clear = function clear() {
    if (arguments.length === 0) {
      reset();
      return;
    }

    let node = root;

    for (let i = 0, l = arguments.length; i < l; i++) {
      const arg = arguments[i];
      const primitive =
        arg === null || (typeof arg !== "object" && typeof arg !== "function");

      if (i === arguments.length - 1) {
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
      } else {
        const argsMap = primitive ? node.primitiveArgs : node.referenceArgs;
        if (argsMap.has(arg) === false) {
          break;
        }
        node = argsMap.get(arg);
      }
    }
  };

  return memoized;
};
