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
 * @param {string} token0Decimals Decimals of token 0.
 * @param {string} token1Decimals Decimals of token 1.
 * @param {string} sqrtRatioX96 The tick value.
 * @param {boolean=} optReverse Set to true to reverse the token pair.
 * @return {Object} The chain context.
 */
entity.sqrtPrice = (
  token0Decimals,
  token1Decimals,
  sqrtRatioX96,
  optReverse = false,
) => {
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

  let numerator = adjustedForDecimalsNumerator;
  let denominator = adjustedForDecimalsDenominator;

  if (optReverse) {
    numerator = adjustedForDecimalsDenominator;
    denominator = adjustedForDecimalsNumerator;
  }

  const fraction = [numerator, denominator];

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
