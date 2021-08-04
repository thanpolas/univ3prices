/**
 * @fileoverview Test reserves calculation.
 */

const univ3Price = require('../..');
// const subfix = require('../fixtures/subgraph-results.fix');
const { encodeSqrtRatioX96: encodePriceSqrt } = univ3Price;

const { reserves, getAmountsForLiquidity } = univ3Price;

describe('Uniswap V3 Reserves', () => {
  it('Reserves of token0 and token1 should be as expected', () => {
    // Using DAI/WETH: https://etherscan.io/address/0x60594a405d53811d3bc4766596efd80fd545a270

    const liquidity = '2830981547246997099758055';
    const sqrtPrice = '1550724133884968571999296281';
    const tickSpacing = '60';
    const [token0Reserves, token1Reserves] = reserves(
      liquidity,
      sqrtPrice,
      tickSpacing,
    );
    console.log(
      `token0 reserves: "${token0Reserves}"\ntoken1 reserves: "${token1Reserves}"`,
    );
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
});
