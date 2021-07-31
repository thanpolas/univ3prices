/**
 * @fileoverview Calculates the price (ratio) from sqrt ratio.
 */

const JSBI = require('jsbi');

const chainContext = require('./chain-context');

const entity = (module.exports = {});

// Constants required in ratio calculations.
entity.Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
entity.Q192 = JSBI.exponentiate(entity.Q96, JSBI.BigInt(2));

/**
 * Calculates the price (ratio) from sqrt ratio.
 *
 * @param {string} token0Decimals Decimals of token 0.
 * @param {string} token1Decimals Decimals of token 1.
 * @param {string} sqrtRatioX96 The tick value.
 * @param {boolean=} optReverse Set to true to reverse the token pair.
 * @return {Object} The chain context.
 */
entity.getPrice = (
  token0Decimals,
  token1Decimals,
  sqrtRatioX96,
  optReverse = false,
) => {
  const scalarNumerator = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(token0Decimals),
  );
  const scalarDenominator = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(token1Decimals),
  );

  const sqrtRatioX96BI = JSBI.BigInt(sqrtRatioX96);

  const inputNumerator = JSBI.multiply(sqrtRatioX96BI, sqrtRatioX96BI);
  const inputDenominator = entity.Q192;

  const adjustedForDecimalsNumerator = JSBI.BigInt(
    JSBI.multiply(scalarNumerator, inputNumerator),
  );
  const adjustedForDecimalsDenominator = JSBI.BigInt(
    JSBI.multiply(scalarDenominator, inputDenominator),
  );

  let numerator = adjustedForDecimalsNumerator;
  let denominator = adjustedForDecimalsDenominator;

  if (optReverse) {
    numerator = adjustedForDecimalsDenominator;
    denominator = adjustedForDecimalsNumerator;
  }

  const fraction = { numerator, denominator };

  const chainCtx = chainContext(fraction);

  return chainCtx;
};
