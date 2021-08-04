/**
 * @fileoverview Testing tick-math. Tests directly ported from Uni V3 SDK.
 * @see https://github1s.com/Uniswap/uniswap-v3-sdk/blob/main/src/utils/tickMath.test.ts
 */

const JSBI = require('jsbi');

const { ONE } = require('../../src/constants');
const univ3Price = require('../..');

const { tickMath } = univ3Price;

describe('TickMath', () => {
  describe('#MIN_TICK', () => {
    it('equals correct value', () => {
      expect(tickMath.MIN_TICK).toEqual(-887272);
    });
  });

  describe('#MAX_TICK', () => {
    it('equals correct value', () => {
      expect(tickMath.MAX_TICK).toEqual(887272);
    });
  });

  describe('#getSqrtRatioAtTick', () => {
    it('throws for non integer', () => {
      expect(() => tickMath.getSqrtRatioAtTick(1.5)).toThrow('TICK');
    });

    it('throws for tick too small', () => {
      expect(() => tickMath.getSqrtRatioAtTick(tickMath.MIN_TICK - 1)).toThrow(
        'TICK',
      );
    });

    it('throws for tick too large', () => {
      expect(() => tickMath.getSqrtRatioAtTick(tickMath.MAX_TICK + 1)).toThrow(
        'TICK',
      );
    });

    it('returns the correct value for min tick', () => {
      expect(tickMath.getSqrtRatioAtTick(tickMath.MIN_TICK)).toEqual(
        tickMath.MIN_SQRT_RATIO,
      );
    });

    it('returns the correct value for tick 0', () => {
      expect(tickMath.getSqrtRatioAtTick(0)).toEqual(
        JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(96)),
      );
    });

    it('returns the correct value for max tick', () => {
      expect(tickMath.getSqrtRatioAtTick(tickMath.MAX_TICK)).toEqual(
        tickMath.MAX_SQRT_RATIO,
      );
    });
  });

  describe('#getTickAtSqrtRatio', () => {
    it('returns the correct value for sqrt ratio at min tick', () => {
      expect(tickMath.getTickAtSqrtRatio(tickMath.MIN_SQRT_RATIO)).toEqual(
        Number(tickMath.MIN_TICK),
      );
    });
    it('returns the correct value for sqrt ratio at max tick', () => {
      expect(
        tickMath.getTickAtSqrtRatio(
          JSBI.subtract(tickMath.MAX_SQRT_RATIO, ONE),
        ),
      ).toEqual(Number(tickMath.MAX_TICK) - 1);
    });
  });
});
