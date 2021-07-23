/**
 * @fileoverview Test tick price calculation.
 */

// const JSBI = require('jsbi');
const univ3Price = require('../..');
const subfix = require('../fixtures/subgraph-results.fix');

const { tick } = univ3Price;
const { eth_usdt: ethusdtfix, susd_usdc: susdfix } = subfix;

// const { encodeSqrtRatioX96, Rounding } = univ3Price;

describe('Uniswap V3 Tick', () => {
  describe('toSignificant', () => {
    describe('Price', () => {
      it('Price of token0 to token1 for stables', () => {
        const priceSqrt = univ3Price(
          ethusdtfix.token0.decimals,
          ethusdtfix.token1.decimals,
          ethusdtfix.sqrtPrice,
        ).toSignificant(5);
        const priceTick = tick(
          ethusdtfix.token0.decimals,
          ethusdtfix.token1.decimals,
          ethusdtfix.tick,
        ).toSignificant(5);

        console.log('priceSqrt:', priceSqrt);
        console.log('priceTick:', priceTick);

        const priceSqrtUsdc = univ3Price(
          susdfix.token0.decimals,
          susdfix.token1.decimals,
          susdfix.sqrtPrice,
        ).toSignificant(5);
        const priceTickUsdc = tick(
          susdfix.token0.decimals,
          susdfix.token1.decimals,
          susdfix.tick,
        ).toSignificant(5);

        console.log('priceSqrtUsdc:', priceSqrtUsdc);
        console.log('priceTickUsdc:', priceTickUsdc);
      });
    });
  });
});
