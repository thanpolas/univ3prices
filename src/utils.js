/**
 * @fileoverview Utilities and helpers.
 */
const JSBI = require('jsbi');
const invariant = require('invariant');

const MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER);

const ZERO = JSBI.BigInt(0);
const ONE = JSBI.BigInt(1);
const TWO = JSBI.BigInt(2);

const utils = (module.exports = {});
/**
 * Calculates the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 *
 * @param {bigint} amount1 the numerator amount, i.e. amount of token1.
 * @param {bigint} amount0 the denominator amount, i.en amount of token0.
 * @return {bigint} the sqrt ratio.
 */
utils.encodeSqrtRatioX96 = (amount1, amount0) => {
  const numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(192));
  const denominator = JSBI.BigInt(amount0);
  const ratioX192 = JSBI.divide(numerator, denominator);
  return utils.sqrt(ratioX192);
};

/**
 * Computes floor(sqrt(value))
 *
 * @param {bigint} value the value for which to compute the square root, rounded down
 * @return {bigint}
 */
utils.sqrt = (value) => {
  invariant(JSBI.greaterThanOrEqual(value, ZERO), 'NEGATIVE');

  // rely on built in sqrt if possible
  if (JSBI.lessThan(value, MAX_SAFE_INTEGER)) {
    return JSBI.BigInt(Math.floor(Math.sqrt(JSBI.toNumber(value))));
  }

  let z = value;
  let x = JSBI.add(JSBI.divide(value, TWO), ONE);

  while (JSBI.lessThan(x, z)) {
    z = x;
    x = JSBI.divide(JSBI.add(JSBI.divide(value, x), x), TWO);
  }
  return z;
};

/**
 * Calculates the tick local range (bottom and top) values given the tick and
 * spacing.
 *
 * @param {string} tickStr The tick value.
 * @param {string} tickSpacingStr The tick spacing value.
 * @param {number=} tickStep How many tick steps wide to capture liquidity.
 * @return {Array<number>} a tuple of the lower and highest tick local range.
 */
utils.tickRange = (tickStr, tickSpacingStr, tickStep = 0) => {
  const tick = Number(tickStr);
  const tickSpacing = Number(tickSpacingStr);

  const tickSpacingStepped = tickSpacing * tickStep;

  const tickLow =
    Math.floor(tick / tickSpacing) * tickSpacing - tickSpacingStepped;
  const tickHigh = tickLow + tickSpacing + tickSpacingStepped * 2;

  return [tickLow, tickHigh];
};

/**
 * Will calculate the exponent for the given decimals number.
 *
 * @param {string|number} decs The decimal number.
 * @return {bigint} The decimals exponent.
 */
utils.expDecs = (decs) => {
  return JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decs));
};

/**
 * Converts a value to JSBI, if it's already a JSBI will just return it.
 *
 * @param {string|number|JSBI} numstr The value to convert.
 * @return {bigint} JSBI representation of the value.
 */
utils.biConv = (numstr) => {
  let bi = numstr;
  if (typeof sqrtRatio !== 'bigint') {
    bi = JSBI.BigInt(numstr);
  }
  return bi;
};
