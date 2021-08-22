const JSBI = require('jsbi');

const univ3Prices = require('../..');

const { encodeSqrtRatioX96, sqrt, tickRange } = univ3Prices.utils;
const { Q96 } = univ3Prices.constants;

const MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

describe('Utils', () => {
  describe('encodeSqrtRatioX96()', () => {
    it('1/1', () => {
      expect(encodeSqrtRatioX96(1, 1)).toEqual(Q96);
    });

    it('100/1', () => {
      expect(encodeSqrtRatioX96(100, 1)).toEqual(
        JSBI.BigInt('792281625142643375935439503360'),
      );
    });

    it('1/100', () => {
      expect(encodeSqrtRatioX96(1, 100)).toEqual(
        JSBI.BigInt('7922816251426433759354395033'),
      );
    });

    it('111/333', () => {
      expect(encodeSqrtRatioX96(111, 333)).toEqual(
        JSBI.BigInt('45742400955009932534161870629'),
      );
    });

    it('333/111', () => {
      expect(encodeSqrtRatioX96(333, 111)).toEqual(
        JSBI.BigInt('137227202865029797602485611888'),
      );
    });
  });
  describe('sqrt()', () => {
    it('correct for 0-1000', () => {
      for (let i = 0; i < 1000; i += 1) {
        expect(sqrt(JSBI.BigInt(i))).toEqual(
          JSBI.BigInt(Math.floor(Math.sqrt(i))),
        );
      }
    });

    it('correct for all even powers of 2', () => {
      for (let i = 0; i < 1000; i += 1) {
        const root = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(i));
        const rootSquared = JSBI.multiply(root, root);

        expect(sqrt(rootSquared)).toEqual(root);
      }
    });

    it('correct for MaxUint256', () => {
      expect(sqrt(MaxUint256)).toEqual(
        JSBI.BigInt('340282366920938463463374607431768211455'),
      );
    });
  });
  describe('tickRange()', () => {
    it('should return the expected tick range', () => {
      const [rangeLow, rangeHigh] = tickRange('1001', '60');
      expect(rangeLow).toEqual(960);
      expect(rangeHigh).toEqual(1020);
    });
    it('should return the expected tick range with a tickstep of 5', () => {
      const [rangeLow, rangeHigh] = tickRange('1001', '60', 5);
      expect(rangeLow).toEqual(660);
      expect(rangeHigh).toEqual(1320);
    });
  });
});
