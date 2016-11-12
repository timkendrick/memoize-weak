function MapTree() {
  this.primitiveBranches = new Map();
  this.objectBranches = new WeakMap();
  this.hasValue = false;
  this.value = undefined;
}

MapTree.prototype.getBranch = function getBranch(key) {
  var branch;
  var isObjectKey = (typeof key === 'object') && (key !== null);
  var branchesMap = (isObjectKey ? this.objectBranches : this.primitiveBranches);
  if (branchesMap.has(key)) { return branchesMap.get(key); }
  branch = new MapTree();
  branchesMap.set(key, branch);
  return branch;
};

MapTree.prototype.setValue = function setValue(value) {
  this.hasValue = true;
  return (this.value = value);
};

module.exports = function memoize(fn) {
  var argsTree = new MapTree();
  return function memoized() {
    var value;
    var args = Array.prototype.slice.call(arguments);
    var argNode = args.reduce(function getBranch(parentBranch, arg) {
      return parentBranch.getBranch(arg);
    }, argsTree);
    if (argNode.hasValue) { return argNode.value; }
    value = fn.apply(null, args);
    return argNode.setValue(value);
  };
};
