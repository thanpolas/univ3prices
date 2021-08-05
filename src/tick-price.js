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

  const fraction = [
    optReverse ? denominator : numerator,
    optReverse ? numerator : denominator,
  ];

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
