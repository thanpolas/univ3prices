/**
 * @fileoverview Testing tick-math. Tests directly ported from Uni V3 SDK.
 * @see https://github1s.com/Uniswap/uniswap-v3-sdk/blob/main/src/utils/tickMath.test.ts
 */

const JSBI = require('jsbi');

const {
  ONE,
  MIN_TICK,
  MAX_TICK,
  MIN_SQRT_RATIO,
  MAX_SQRT_RATIO,
} = require('../../src/constants');
const univ3Price = require('../..');

const { tickMath } = univ3Price;

describe('TickMath', () => {
  describe('#MIN_TICK', () => {
    it('equals correct value', () => {
      expect(MIN_TICK).toEqual(-887272);
    });
  });

  describe('#MAX_TICK', () => {
    it('equals correct value', () => {
      expect(MAX_TICK).toEqual(887272);
    });
  });

  describe('#getSqrtRatioAtTick', () => {
    it('throws for non integer', () => {
      expect(() => tickMath.getSqrtRatioAtTick(1.5)).toThrow('TICK');
    });

    it('throws for tick too small', () => {
      expect(() => tickMath.getSqrtRatioAtTick(MIN_TICK - 1)).toThrow('TICK');
    });

    it('throws for tick too large', () => {
      expect(() => tickMath.getSqrtRatioAtTick(MAX_TICK + 1)).toThrow('TICK');
    });

    it('returns the correct value for min tick', () => {
      expect(tickMath.getSqrtRatioAtTick(MIN_TICK)).toEqual(MIN_SQRT_RATIO);
    });

    it('returns the correct value for tick 0', () => {
      expect(tickMath.getSqrtRatioAtTick(0)).toEqual(
        JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(96)),
      );
    });

    it('returns the correct value for max tick', () => {
      expect(tickMath.getSqrtRatioAtTick(MAX_TICK)).toEqual(MAX_SQRT_RATIO);
    });
  });

  describe('#getTickAtSqrtRatio', () => {
    it('returns the correct value for sqrt ratio at min tick', () => {
      expect(tickMath.getTickAtSqrtRatio(MIN_SQRT_RATIO)).toEqual(
        Number(MIN_TICK),
      );
    });
    it('returns the correct value for sqrt ratio at max tick', () => {
      expect(
        tickMath.getTickAtSqrtRatio(JSBI.subtract(MAX_SQRT_RATIO, ONE)),
      ).toEqual(Number(MAX_TICK) - 1);
    });
  });
});
