/**
 * @fileoverview Calculates the reserves given the liquidity value and sqrt values.
 */

const JSBI = require('jsbi');

// const chainContext = require('./chain-context');
const { RESOLUTION, Q96 } = require('./constants');
const { getSqrtRatioAtTick, getTickAtSqrtRatio } = require('./tick-math');
const { tickRange, expDecs, biConv } = require('./utils');
const { toFixed } = require('./formatting');

const entity = (module.exports = {});

/**
 * Calculates the reserves of tokens based on the current tick value.
 *
 * @param {string} dec0 Decimals of first token.
 * @param {string} dec1 Decimals of second token.
 * @param {string} liquidityStr The liquidity value.
 * @param {string} sqrtPriceStr The sqrt price value.
 * @param {string} tickSpacing The spacing between the ticks.
 * @return {Array<string>} A tuple with the reserves of token0 and token1.
 */
entity.reserves = (dec0, dec1, liquidityStr, sqrtPriceStr, tickSpacing) => {
  const tok0Dec = expDecs(dec0);
  const tok1Dec = expDecs(dec1);

  const sqrtPrice = JSBI.BigInt(sqrtPriceStr);
  const liquidity = JSBI.BigInt(liquidityStr);
  const tick = getTickAtSqrtRatio(sqrtPrice);

  const [tickLow, tickHigh] = tickRange(tick, tickSpacing);

  const sqrtA = getSqrtRatioAtTick(tickLow);
  const sqrtB = getSqrtRatioAtTick(tickHigh);

  const reserves = entity.getAmountsForLiquidity(
    sqrtPrice,
    sqrtA,
    sqrtB,
    liquidity,
  );

  const [amount0Raw, amount1Raw] = reserves;

  const fraction0 = [amount0Raw, tok0Dec];
  const fraction1 = [amount1Raw, tok1Dec];

  const reservesFormatted = [toFixed(fraction0, 1), toFixed(fraction1, 1)];

  return reservesFormatted;
};

/**
 * Calculates the amount of token0 and token1 given current sqrt price and a range.
 *
 * @param {JSBI|string} sqrtRatioX96 Current SQRT Price.
 * @param {JSBI|string} sqrtRatioAX96 A sqrt price representing the first tick boundary.
 * @param {JSBI|string} sqrtRatioBX96 A sqrt price representing the second tick boundary.
 * @param {JSBI|string} liquidityStr The liquidity being valued.
 * @return {Array<string>} A tuple with the reserves of token0 and token1.
 */
entity.getAmountsForLiquidity = (
  sqrtRatioX96,
  sqrtRatioAX96,
  sqrtRatioBX96,
  liquidityStr,
) => {
  const sqrtRatio = biConv(sqrtRatioX96);
  let sqrtRatioA = biConv(sqrtRatioAX96);
  let sqrtRatioB = biConv(sqrtRatioBX96);
  const liquidity = biConv(liquidityStr);

  if (JSBI.greaterThan(sqrtRatioA, sqrtRatioB)) {
    sqrtRatioA = sqrtRatioB;
    sqrtRatioB = sqrtRatioA;
  }

  let amount0 = 0;
  let amount1 = 0;

  if (JSBI.lessThanOrEqual(sqrtRatio, sqrtRatioA)) {
    amount0 = entity.getAmount0ForLiquidity(sqrtRatioA, sqrtRatioB, liquidity);
  } else if (JSBI.lessThan(sqrtRatio, sqrtRatioB)) {
    amount0 = entity.getAmount0ForLiquidity(sqrtRatio, sqrtRatioB, liquidity);
    amount1 = entity.getAmount1ForLiquidity(sqrtRatioA, sqrtRatio, liquidity);
  } else {
    amount1 = entity.getAmount1ForLiquidity(sqrtRatioA, sqrtRatioB, liquidity);
  }

  return [amount0, amount1];
};

/**
 * Computes the amount of token0 for a given amount of liquidity and a price range.
 *
 * @param {JSBI} sqrtRatioAX96 A sqrt price representing the first tick boundary.
 * @param {JSBI} sqrtRatioBX96 A sqrt price representing the second tick boundary.
 * @param {JSBI} liquidity The liquidity being valued.
 * @return {number} The amount of token0.
 */
entity.getAmount0ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
  let sqrtRatioA = sqrtRatioAX96;
  let sqrtRatioB = sqrtRatioBX96;

  if (JSBI.greaterThan(sqrtRatioA, sqrtRatioB)) {
    sqrtRatioA = sqrtRatioB;
    sqrtRatioB = sqrtRatioA;
  }

  const leftShiftedLiquidity = JSBI.leftShift(liquidity, RESOLUTION);
  const sqrtDiff = JSBI.subtract(sqrtRatioB, sqrtRatioA);
  const multipliedRes = JSBI.multiply(leftShiftedLiquidity, sqrtDiff);
  const numerator = JSBI.divide(multipliedRes, sqrtRatioB);

  const amount0 = JSBI.divide(numerator, sqrtRatioA);

  return amount0;
};

/**
 * Computes the amount of token1 for a given amount of liquidity and a price range.
 *
 * @param {JSBI} sqrtRatioAX96 A sqrt price representing the first tick boundary.
 * @param {JSBI} sqrtRatioBX96 A sqrt price representing the second tick boundary.
 * @param {JSBI} liquidity The liquidity being valued.
 * @return {number} The amount of token1.
 */
entity.getAmount1ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
  let sqrtRatioA = sqrtRatioAX96;
  let sqrtRatioB = sqrtRatioBX96;

  if (JSBI.greaterThan(sqrtRatioA, sqrtRatioB)) {
    sqrtRatioA = sqrtRatioB;
    sqrtRatioB = sqrtRatioA;
  }

  const sqrtDiff = JSBI.subtract(sqrtRatioB, sqrtRatioA);
  const multipliedRes = JSBI.multiply(liquidity, sqrtDiff);

  const amount1 = JSBI.divide(multipliedRes, Q96);

  return amount1;
};
