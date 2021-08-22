/**
 * @fileoverview Test tick price calculation.
 */

// const JSBI = require('jsbi');
const univ3Price = require('../..');
const subfix = require('../fixtures/subgraph-results.fix');

const { tickPrice } = univ3Price;
const { eth_usdt: ethusdtfix, susd_usdc: susdfix } = subfix;

// const { encodeSqrtRatioX96, Rounding } = univ3Price;

/**
 * Helper to calculate tickPrice.
 *
 * @param {Object} fix The fixture to use.
 * @param {boolean=} optReverse Set to true for reverse calculation.
 * @param {number=} optSignigicantDigits Set to significant digits.
 * @return {string} The result.
 */
function runCalc(fix, optReverse = false, optSignigicantDigits) {
  const priceTick = tickPrice(
    [fix.token0.decimals, fix.token1.decimals],
    fix.tick,
  ).toSignificant({ decimalPlaces: optSignigicantDigits, reverse: optReverse });

  return priceTick;
}

describe('Uniswap V3 Tick Price', () => {
  describe('toSignificant', () => {
    describe('Price', () => {
      it('Price of token0 to token1 for ETH', () => {
        expect(runCalc(ethusdtfix)).toEqual('0.00048521');
      });
      it('Price of token0 to token1 for ETH reversed', () => {
        expect(runCalc(ethusdtfix, true)).toEqual('2060.9');
      });
      it('Price of token0 to token1 for Stables', () => {
        expect(runCalc(susdfix)).toEqual('0.99114');
      });
      it('Price of token0 to token1 for Stables reversed', () => {
        expect(runCalc(susdfix, true)).toEqual('1.0089');
      });
    });
  });
});
