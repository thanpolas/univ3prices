/**
 * @fileoverview Test reserves calculation.
 */

const univ3Price = require('../..');
const { dai_weth } = require('../fixtures/univ3-pool-results');

const { encodeSqrtRatioX96: encodePriceSqrt } = univ3Price.utils;

const { getAmountsForLiquidityFormatted, getAmountsForLiquidity } = univ3Price;

describe('Uniswap V3 Liquidity', () => {
  describe('getAmountsForLiquidityFormatted()', () => {
    it('Amounts of token0 and token1 should be as expected', () => {
      const [token0Reserves, token1Reserves] = getAmountsForLiquidityFormatted(
        dai_weth.token0_decimals,
        dai_weth.token1_decimals,
        dai_weth.liquidity,
        dai_weth.sqrtPrice,
        dai_weth.tickSpacing,
      );

      expect(token0Reserves).toEqual('116596.9');
      expect(token1Reserves).toEqual('121.4');
    });
  });
  it('Amounts of token0 and token1 should be as expected with tick step 5', () => {
    const [token0Reserves, token1Reserves] = getAmountsForLiquidityFormatted(
      dai_weth.token0_decimals,
      dai_weth.token1_decimals,
      dai_weth.liquidity,
      dai_weth.sqrtPrice,
      dai_weth.tickSpacing,
      5,
    );

    expect(token0Reserves).toEqual('116596.9');
    expect(token1Reserves).toEqual('944.5');
  });
});
describe('uniswap-v3-periphery spec', () => {
  it('amounts for price inside', () => {
    const sqrtPriceX96 = encodePriceSqrt(1, 1);
    const sqrtPriceAX96 = encodePriceSqrt(100, 110);
    const sqrtPriceBX96 = encodePriceSqrt(110, 100);
    const [amount0, amount1] = getAmountsForLiquidity(
      sqrtPriceX96,
      sqrtPriceAX96,
      sqrtPriceBX96,
      2148,
    );

    expect(Number(amount0)).toEqual(99);
    expect(Number(amount1)).toEqual(99);
  });

  it('amounts for price below', () => {
    const sqrtPriceX96 = encodePriceSqrt(99, 110);
    const sqrtPriceAX96 = encodePriceSqrt(100, 110);
    const sqrtPriceBX96 = encodePriceSqrt(110, 100);
    const [amount0, amount1] = getAmountsForLiquidity(
      sqrtPriceX96,
      sqrtPriceAX96,
      sqrtPriceBX96,
      1048,
    );

    expect(Number(amount0)).toEqual(99);
    expect(Number(amount1)).toEqual(0);
  });

  it('amounts for price above', () => {
    const sqrtPriceX96 = encodePriceSqrt(111, 100);
    const sqrtPriceAX96 = encodePriceSqrt(100, 110);
    const sqrtPriceBX96 = encodePriceSqrt(110, 100);
    const [amount0, amount1] = getAmountsForLiquidity(
      sqrtPriceX96,
      sqrtPriceAX96,
      sqrtPriceBX96,
      2097,
    );
    expect(Number(amount0)).toEqual(0);
    expect(Number(amount1)).toEqual(199);
  });

  it('amounts for price on lower boundary', () => {
    const sqrtPriceAX96 = encodePriceSqrt(100, 110);
    const sqrtPriceX96 = sqrtPriceAX96;
    const sqrtPriceBX96 = encodePriceSqrt(110, 100);
    const [amount0, amount1] = getAmountsForLiquidity(
      sqrtPriceX96,
      sqrtPriceAX96,
      sqrtPriceBX96,
      1048,
    );
    expect(Number(amount0)).toEqual(99);
    expect(Number(amount1)).toEqual(0);
  });

  it('amounts for price on upper boundary', () => {
    const sqrtPriceAX96 = encodePriceSqrt(100, 110);
    const sqrtPriceBX96 = encodePriceSqrt(110, 100);
    const sqrtPriceX96 = sqrtPriceBX96;
    const [amount0, amount1] = getAmountsForLiquidity(
      sqrtPriceX96,
      sqrtPriceAX96,
      sqrtPriceBX96,
      2097,
    );
    expect(Number(amount0)).toEqual(0);
    expect(Number(amount1)).toEqual(199);
  });
});
