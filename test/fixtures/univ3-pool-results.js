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

// Using USDC/WETH: https://etherscan.io/address/0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8
fix.usdc_weth = {
  token0_decimals: 6,
  token1_decimals: 18,
  liquidity: '23187408889601892673',
  sqrtPrice: '1510978141923922864297330642137308',
  tickSpacing: '60',
};

// Using UNI/USDC: https://etherscan.io/address/0xd0fc8ba7e267f2bc56044a7715a489d851dc6d78#readContract
fix.uni_usdc = {
  token0_decimals: 18,
  token1_decimals: 6,
  liquidity: '647424456336700945',
  sqrtPrice: '424427182250808799309705',
  tickSpacing: '60',
};
