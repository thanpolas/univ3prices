/**
 * @fileoverview Fixtures from uniswap v3 Liquidity Pool contracts.
 */

const fix = (module.exports = {});

// Using DAI/WETH: https://etherscan.io/address/0x60594a405d53811d3bc4766596efd80fd545a270
fix.dai_weth = {
  token0_decimals: 18,
  token1_decimals: 18,
  liquidity: '2830981547246997099758055',
  sqrtPrice: '1550724133884968571999296281',
  tickSpacing: '60',
};
