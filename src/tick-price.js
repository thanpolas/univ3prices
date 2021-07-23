/**
 * @fileoverview Calculates the price based on tick value.
 */

const JSBI = require('jsbi');
const chainContext = require('./chain-context');

const entity = (module.exports = {});

entity.tick = (token0Decimals, token1Decimals, tick, optReverse = false) => {
  const t0dec = Number(token0Decimals);
  const t1dec = Number(token1Decimals);
  const absTick = Math.abs(tick);

  const denominator = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(Math.abs(t0dec - t1dec)),
  );

  const numerator = 1.0001 ** absTick;

  const fraction = {
    numerator: ratioNumerator,
    denominator: tokendecs,
  };

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
