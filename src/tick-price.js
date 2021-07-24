/**
 * @fileoverview Calculates the price based on tick value.
 */

const JSBI = require('jsbi');
const chainContext = require('./chain-context');

const entity = (module.exports = {});

/**
 * Calculates the price based on tick value.
 *
 * @param {string} token0Decimals Decimals of token 0.
 * @param {string} token1Decimals Decimals of token 1.
 * @param {string} tick The tick value.
 * @param {boolean=} optReverse Set to true to reverse the token pair.
 * @return {Object} The chain context.
 */
entity.tickPrice = (
  token0Decimals,
  token1Decimals,
  tick,
  optReverse = false,
) => {
  const t0dec = Number(token0Decimals);
  const t1dec = Number(token1Decimals);
  const absTick = Math.abs(tick);

  const denominator = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(Math.abs(t0dec - t1dec)),
  );

  const numerator = 1.0001 ** absTick;

  const fraction = {
    numerator: optReverse ? denominator : numerator,
    denominator: optReverse ? numerator : denominator,
  };

  const chainCtx = chainContext(fraction);

  return chainCtx;
};

/**
 * WIP: Calculate the tick from the sqrt ratio.
 *
 * @param {string} decimals0 Decimals of token 0.
 * @param {string} decimals1 Decimals of token 1.
 * @param {string} sqrtRatioX96 The tick value.
 * @return {number} The tick value.
 */
entity.sqrtRatioToTick = (decimals0, decimals1, sqrtRatioX96) => {
  return (
    (1 / (Number(sqrtRatioX96) ** 2 / 2 ** (96 * 2))) *
    10 ** (Number(decimals1) - Number(decimals0))
  );
};
