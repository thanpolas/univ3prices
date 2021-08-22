/**
 * @fileoverview Calculates the price (ratio) from sqrt ratio.
 */

const JSBI = require('jsbi');

const chainContext = require('./chain-context');
const { Q192 } = require('./constants');
const { expDecs } = require('./utils');

const entity = (module.exports = {});

/**
 * Calculates the price (ratio) from sqrt price.
 *
 * @param {Array<number|string>} tokenDecimals Array tuple of token decimals.
 * @param {string} sqrtRatioX96 The tick value.
 * @return {Object} The chain context.
 */
entity.sqrtPrice = (tokenDecimals, sqrtRatioX96) => {
  const [token0Decimals, token1Decimals] = tokenDecimals;
  const scalarNumerator = expDecs(token0Decimals);
  const scalarDenominator = expDecs(token1Decimals);

  const sqrtRatioX96BI = JSBI.BigInt(sqrtRatioX96);

  const inputNumerator = JSBI.multiply(sqrtRatioX96BI, sqrtRatioX96BI);
  const inputDenominator = Q192;

  const adjustedForDecimalsNumerator = JSBI.BigInt(
    JSBI.multiply(scalarDenominator, inputDenominator),
  );
  const adjustedForDecimalsDenominator = JSBI.BigInt(
    JSBI.multiply(scalarNumerator, inputNumerator),
  );

  const numerator = adjustedForDecimalsNumerator;
  const denominator = adjustedForDecimalsDenominator;

  const fraction = [numerator, denominator];

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
