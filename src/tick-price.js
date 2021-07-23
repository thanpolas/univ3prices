/**
 * @fileoverview Calculates the price based on tick value.
 */

const JSBI = require('jsbi');
const chainContext = require('./chain-context');

const entity = (module.exports = {});

entity.tick = (token0Decimals, token1Decimals, tick, optReverse = false) => {
  const t0dec = Number(token0Decimals);
  const t1dec = Number(token1Decimals);
  let absTick = Number(tick);
  if (absTick < 0) {
    absTick *= -1;
  }

  const tokendecs = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(Math.abs(t0dec - t1dec)),
  );

  const ratioNumerator = 1.0001 ** tick;

  const fraction = {
    numerator: ratioNumerator,
    denominator: tokendecs,
  };

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
