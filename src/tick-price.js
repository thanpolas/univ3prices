/**
 * @fileoverview Calculates the price based on tick value.
 */

const JSBI = require('jsbi');
const chainContext = require('./chain-context');

const entity = (module.exports = {});

/**
 * Calculates the price based on tick value.
 *
 * @param {Array<number|string>} tokenDecimals Array tuple of token decimals.
 * @param {string} tick The tick value.
 * @return {Object} The chain context.
 */
entity.tickPrice = (tokenDecimals, tick) => {
  const [token0Decimals, token1Decimals] = tokenDecimals;
  const t0dec = Number(token0Decimals);
  const t1dec = Number(token1Decimals);
  const absTick = Math.abs(tick);

  const denominator = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(Math.abs(t0dec - t1dec)),
  );

  const numerator = 1.0001 ** absTick;

  const fraction = [numerator, denominator];

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
