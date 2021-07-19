/**
 * @fileoverview Calculates the price (ratio) of a Uniswap V3 Liquidity Pool.
 */

const JSBI = require('jsbi');

const chainContext = require('./chain-context');

// Constants required in ratio calculations.
const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

const entity = (module.exports = {});

entity.getPrice = (
  token0Decimals,
  token1Decimals,
  sqrtRatioX96,
  optReverse = false,
) => {
  const token0decs = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(token0Decimals),
  );
  const token1decs = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(token1Decimals),
  );

  const sqrtRatioX96BI = JSBI.BigInt(sqrtRatioX96);

  const origValue = JSBI.multiply(sqrtRatioX96BI, sqrtRatioX96BI);

  let token0Multi = Q192;
  let token1Multi = origValue;

  if (optReverse) {
    token0Multi = origValue;
    token1Multi = Q192;
  }

  const fraction = {
    numerator: JSBI.BigInt(JSBI.multiply(token1Multi, token1decs)),
    denominator: JSBI.BigInt(JSBI.multiply(token0Multi, token0decs)),
  };

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
