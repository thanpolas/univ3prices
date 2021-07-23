/**
 * @fileoverview Fixtures to calculate prices from subgraph queries.
 */

const fix = (module.exports = {});

fix.eth_usdt = {
  liquidity: '2307998591984700596',
  sqrtPrice: '3596898861518726086759802',
  tick: '-200011',
  token0Price: '0.0004851798039860258545625640847644105',
  token1Price: '2061.091561900218734673188511148771',
  token0: {
    symbol: 'WETH',
    decimals: '18',
  },
  token1: {
    symbol: 'USDT',
    decimals: '6',
  },
};

fix.susd_usdc = {
  feeTier: '500',
  id: '0x6a9850e46518231b23e50467c975fa94026be5d5',
  liquidity: '8111796489156420973',
  sqrtPrice: '79584309782502206233778',
  tick: '-276235',
  token0: {
    decimals: '18',
    symbol: 'sUSD',
  },
  token0Price: '0.9910698384403888072303619883621213',
  token1: {
    decimals: '6',
    symbol: 'USDC',
  },
  token1Price: '1.009010627922714577745385027425698',
};
