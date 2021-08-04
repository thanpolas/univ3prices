/**
 * @fileoverview Test reserves calculation.
 */

// const JSBI = require('jsbi');
const univ3Price = require('../..');
// const subfix = require('../fixtures/subgraph-results.fix');

const { reserves } = univ3Price;

describe('Uniswap V3 Reserves', () => {
  describe('toSignificant', () => {
    describe('DAI/USDC', () => {
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
    });
  });
});
