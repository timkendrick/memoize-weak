module.exports = function memoize(fn) {
  const root = [];

  const memoized = function memoized() {
    let node = root;
    let param = this;
    let map;

    for (let i = -1, l = arguments.length; i < l; i++) {
      if (i >= 0) {
        param = arguments[i];
      }

      const primitive =
        param === null ||
        (typeof param !== "object" && typeof param !== "function");

      if (primitive) {
        if (typeof node[0] === "undefined") {
          map = node[0] = new Map();
        } else {
          map = node[0];
        }
      } else {
        if (typeof node[1] === "undefined") {
          map = node[1] = new WeakMap();
        } else {
          map = node[1];
        }
      }

      if (map.has(param) === false) {
        node = [];
        map.set(param, node);
      } else {
        node = map.get(param);
      }
    }

    if (node.length !== 3) {
      node[2] = fn.apply(this, arguments);
    }

    return node[2];
  };

  memoized.clear = function clear() {
    if (this === memoized) {
      memoized.clear.apply(null, arguments);
      return;
    }

    let node = root;
    let param = this;
    let map;

    for (let i = -1, l = arguments.length; i < l; i++) {
      if (i >= 0) {
        param = arguments[i];
      }

      const primitive =
        param === null ||
        (typeof param !== "object" && typeof param !== "function");

      if (primitive) {
        if (typeof node[0] === "undefined") {
          return;
        } else {
          map = node[0];
        }
      } else {
        if (typeof node[1] === "undefined") {
          return;
        } else {
          map = node[1];
        }
      }

      if (map.has(param) === false) {
        return;
      } else {
        node = map.get(param);
      }
    }

    map.delete(param);
  };

  return memoized;
};
