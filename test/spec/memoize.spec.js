const { expect } = require('chai');
const { spy } = require('sinon');

const memoize = require('../../lib/memoize');

describe('memoize', () => {
  it('SHOULD return a function', () => {
    const actual = memoize(() => {});
    const expected = Function;
    expect(actual).to.be.an.instanceOf(expected);
  });

  describe('GIVEN a memoized function that expects no arguments', () => {
    const fn = spy(() => 'foo');
    let memoized;
    before(() => {
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called', () => {
      before(() => {
        memoized();
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = [];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.returnValue;
        const expected = 'foo';
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again', () => {
        before(() => {
          memoized();
        });

        it('SHOULD only call the underlying function once', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.returnValue;
          const expected = 'foo';
          expect(actual).to.deep.equal(expected);
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects a single primitive argument', () => {
    const fn = spy((...args) => args);
    let memoized;
    before(() => {
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with a single primitive argument', () => {
      before(() => {
        memoized('foo');
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = ['foo'];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.returnValue;
        const expected = ['foo'];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again with the same argument', () => {
        before(() => {
          memoized('foo');
        });

        it('SHOULD only call the underlying function once', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.returnValue;
          const expected = ['foo'];
          expect(actual).to.deep.equal(expected);
        });

        describe('AND the memoized function is called again with a different argument', () => {
          before(() => {
            memoized('bar');
          });

          it('SHOULD call the underlying function with the correct arguments', () => {
            const actual = fn.secondCall.args;
            const expected = ['bar'];
            expect(actual).to.deep.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.thirdCall.returnValue;
            const expected = ['bar'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects a single object argument', () => {
    const fn = spy((...args) => args);
    let memoized;
    before(() => {
      memoized = spy(memoize(fn));
    });

    describe('AND the function is called with a single object argument', () => {
      const foo = { foo: true };
      before(() => {
        memoized(foo);
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = [foo];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.args;
        const expected = [foo];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again with the same argument', () => {
        before(() => {
          memoized(foo);
        });

        it('SHOULD only call the underlying function once', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.args;
          const expected = [foo];
          expect(actual).to.deep.equal(expected);
        });

        describe('AND the memoized function is called again with a different argument', () => {
          const bar = { bar: true };
          before(() => {
            memoized(bar);
          });

          it('SHOULD call the underlying function with the correct arguments', () => {
            const actual = fn.secondCall.args;
            const expected = [bar];
            expect(actual).to.deep.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.thirdCall.returnValue;
            const expected = [bar];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects multiple primitive arguments', () => {
    const fn = spy((...args) => args);
    let memoized;
    before(() => {
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with multiple primitive arguments', () => {
      before(() => {
        memoized('foo', 'bar', 'baz');
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = ['foo', 'bar', 'baz'];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.returnValue;
        const expected = ['foo', 'bar', 'baz'];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again with the same arguments', () => {
        before(() => {
          memoized('foo', 'bar', 'baz');
        });

        it('SHOULD only call the underlying function once', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.returnValue;
          const expected = ['foo', 'bar', 'baz'];
          expect(actual).to.deep.equal(expected);
        });

        describe('AND the memoized function is called again with different arguments', () => {
          before(() => {
            memoized('foo', 'bar', 'qux');
          });

          it('SHOULD call the underlying function with the correct arguments', () => {
            const actual = fn.secondCall.args;
            const expected = ['foo', 'bar', 'qux'];
            expect(actual).to.deep.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.thirdCall.returnValue;
            const expected = ['foo', 'bar', 'qux'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects multiple object arguments', () => {
    const fn = spy((...args) => args);
    let memoized;
    before(() => {
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with multiple object arguments', () => {
      const foo = { foo: true };
      const bar = { bar: true };
      const baz = { baz: true };
      before(() => {
        memoized(foo, bar, baz);
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = [foo, bar, baz];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.returnValue;
        const expected = [foo, bar, baz];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again with the same arguments', () => {
        before(() => {
          memoized(foo, bar, baz);
        });

        it('SHOULD only call the underlying function once', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.returnValue;
          const expected = [foo, bar, baz];
          expect(actual).to.deep.equal(expected);
        });

        describe('AND the memoized function is called again with different arguments', () => {
          const qux = { qux: true };
          before(() => {
            memoized(foo, bar, qux);
          });

          it('SHOULD call the underlying function with the correct arguments', () => {
            const actual = fn.secondCall.args;
            const expected = [foo, bar, qux];
            expect(actual).to.deep.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.thirdCall.returnValue;
            const expected = [foo, bar, qux];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that allows null, undefined and false arguments', () => {
    const fn = spy((...args) => args);
    let memoized;
    before(() => {
      memoized = spy(memoize(fn));
    });


    describe('AND the memoized function is called with null, undefined and false arguments', () => {
      before(() => {
        memoized(null, undefined, false);
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = [null, undefined, false];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.returnValue;
        const expected = [null, undefined, false];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again with the same arguments', () => {
        before(() => {
          memoized(null, undefined, false);
        });

        it('SHOULD only call the underlying function once', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.returnValue;
          const expected = [null, undefined, false];
          expect(actual).to.deep.equal(expected);
        });
      });
    });
  });
});
