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
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy(() => 'foo');
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called', () => {
      beforeEach(() => {
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
        beforeEach(() => {
          memoized();
        });

        it('SHOULD NOT call the underlying function again', () => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again', () => {
          beforeEach(() => {
            memoized();
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = 'foo';
            expect(actual).to.deep.equal(expected);
          });

          describe('AND the memoized function is called again', () => {
            beforeEach(() => {
              memoized();
            });

            it('SHOULD NOT call the underlying function again', () => {
              const actual = fn.callCount;
              const expected = 2;
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
    });
  });

  describe('GIVEN a memoized function that expects a single primitive argument', () => {
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy((...args) => args);
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with a single primitive argument', () => {
      beforeEach(() => {
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
        beforeEach(() => {
          memoized('foo');
        });

        it('SHOULD NOT call the underlying function again', () => {
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
          beforeEach(() => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized('foo');
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for that argument is cleared', () => {
        beforeEach(() => {
          memoized.clear('foo');
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized('foo');
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a different argument is cleared', () => {
        beforeEach(() => {
          memoized.clear('bar');
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized('foo');
          });

          it('SHOULD NOT call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 1;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects a single function argument', () => {
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy((...args) => args);
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with a single function argument', () => {
      const foo = () => {};
      beforeEach(() => {
        memoized(foo);
      });

      it('SHOULD call the underlying function with the correct arguments', () => {
        const actual = fn.firstCall.args;
        const expected = [foo];
        expect(actual).to.deep.equal(expected);
      });

      it('SHOULD return the correct result', () => {
        const actual = memoized.firstCall.returnValue;
        const expected = [foo];
        expect(actual).to.deep.equal(expected);
      });

      describe('AND the memoized function is called again with the same argument', () => {
        beforeEach(() => {
          memoized(foo);
        });

        it('SHOULD NOT call the underlying function again', () => {
          const actual = fn.callCount;
          const expected = 1;
          expect(actual).to.equal(expected);
        });

        it('SHOULD return the correct result', () => {
          const actual = memoized.secondCall.returnValue;
          const expected = [foo];
          expect(actual).to.deep.equal(expected);
        });

        describe('AND the memoized function is called again with a different argument', () => {
          const bar = () => {};
          beforeEach(() => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for that argument is cleared', () => {
        beforeEach(() => {
          memoized.clear(foo);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a different argument is cleared', () => {
        const bar = () => {};
        beforeEach(() => {
          memoized.clear(bar);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo);
          });

          it('SHOULD NOT call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 1;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects a single object argument', () => {
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy((...args) => args);
      memoized = spy(memoize(fn));
    });

    describe('AND the function is called with a single object argument', () => {
      const foo = { foo: true };
      beforeEach(() => {
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
        beforeEach(() => {
          memoized(foo);
        });

        it('SHOULD NOT call the underlying function again', () => {
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
          beforeEach(() => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for that argument is cleared', () => {
        beforeEach(() => {
          memoized.clear(foo);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a different argument is cleared', () => {
        const bar = { bar: true };
        beforeEach(() => {
          memoized.clear(bar);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo);
          });

          it('SHOULD NOT call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 1;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects multiple primitive arguments', () => {
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy((...args) => args);
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with multiple primitive arguments', () => {
      beforeEach(() => {
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
        beforeEach(() => {
          memoized('foo', 'bar', 'baz');
        });

        it('SHOULD NOT call the underlying function again', () => {
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
          beforeEach(() => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again with the same arguments', () => {
          beforeEach(() => {
            memoized('foo', 'bar', 'baz');
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo', 'bar', 'baz'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for that set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear('foo', 'bar', 'baz');
        });

        describe('AND the memoized function is called again with the same arguments', () => {
          beforeEach(() => {
            memoized('foo', 'bar', 'baz');
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo', 'bar', 'baz'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a partial set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear('foo', 'bar');
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized('foo', 'bar', 'baz');
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo', 'bar', 'baz'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a different set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear('foo', 'bar', 'qux');
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized('foo', 'bar', 'baz');
          });

          it('SHOULD NOT call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 1;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = ['foo', 'bar', 'baz'];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that expects multiple object arguments', () => {
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy((...args) => args);
      memoized = spy(memoize(fn));
    });

    describe('AND the memoized function is called with multiple object arguments', () => {
      const foo = { foo: true };
      const bar = { bar: true };
      const baz = { baz: true };
      beforeEach(() => {
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
        beforeEach(() => {
          memoized(foo, bar, baz);
        });

        it('SHOULD NOT call the underlying function again', () => {
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
          beforeEach(() => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again with the same arguments', () => {
          beforeEach(() => {
            memoized(foo, bar, baz);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo, bar, baz];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for that set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear(foo, bar, baz);
        });

        describe('AND the memoized function is called again with the same arguments', () => {
          beforeEach(() => {
            memoized(foo, bar, baz);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo, bar, baz];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a partial set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear(foo, bar);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo, bar, baz);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo, bar, baz];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a different set of arguments is cleared', () => {
        const qux = { qux: true };
        beforeEach(() => {
          memoized.clear(foo, bar, qux);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(foo, bar, baz);
          });

          it('SHOULD NOT call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 1;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [foo, bar, baz];
            expect(actual).to.deep.equal(expected);
          });
        });
      });
    });
  });

  describe('GIVEN a memoized function that allows null, undefined and false arguments', () => {
    let fn;
    let memoized;
    beforeEach(() => {
      fn = spy((...args) => args);
      memoized = spy(memoize(fn));
    });


    describe('AND the memoized function is called with null, undefined and false arguments', () => {
      beforeEach(() => {
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
        beforeEach(() => {
          memoized(null, undefined, false);
        });

        it('SHOULD NOT call the underlying function again', () => {
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

      describe('AND the memoized function\'s cache is cleared', () => {
        beforeEach(() => {
          memoized.clear();
        });

        describe('AND the memoized function is called again with the same arguments', () => {
          beforeEach(() => {
            memoized(null, undefined, false);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [null, undefined, false];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for that set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear(null, undefined, false);
        });

        describe('AND the memoized function is called again with the same arguments', () => {
          beforeEach(() => {
            memoized(null, undefined, false);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [null, undefined, false];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a partial set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear(null, undefined);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(null, undefined, false);
          });

          it('SHOULD call the underlying function again', () => {
            const actual = fn.callCount;
            const expected = 2;
            expect(actual).to.equal(expected);
          });

          it('SHOULD return the correct result', () => {
            const actual = memoized.secondCall.returnValue;
            const expected = [null, undefined, false];
            expect(actual).to.deep.equal(expected);
          });
        });
      });

      describe('AND the memoized function\'s cache for a different set of arguments is cleared', () => {
        beforeEach(() => {
          memoized.clear(null, undefined, 0);
        });

        describe('AND the memoized function is called again with the same argument', () => {
          beforeEach(() => {
            memoized(null, undefined, false);
          });

          it('SHOULD NOT call the underlying function again', () => {
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
});
