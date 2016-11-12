const { expect } = require('chai');

const memoize = require('../..');

describe('memoize-weak', () => {
  it('Should export a function', () => {
    expect(memoize).to.be.a('function');
  });
});
