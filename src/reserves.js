/**
 * @fileoverview Calculates the reserves given the liquidity value and sqrt values.
 */

const JSBI = require('jsbi');

// const chainContext = require('./chain-context');
const { RESOLUTION } = require('./constants');
const { getSqrtRatioAtTick, getTickAtSqrtRatio } = require('./tick-math');
const { tickRange } = require('./utils');

const entity = (module.exports = {});

/**
 * Calculates the price based on tick value.
 *
 * @param {string} liquidityStr The liquidity value.
 * @param {string} sqrtPriceStr The sqrt price value.
 * @param {string} tickSpacing The spacing between the ticks.
 * @return {Object} The chain context.
 */
entity.reserves = (liquidityStr, sqrtPriceStr, tickSpacing) => {
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

  return reserves;
};

entity.getAmountsForLiquidity = (
  sqrtRatioX96,
  sqrtRatioAX96,
  sqrtRatioBX96,
  liquidity,
) => {
  let sqrtRatioA = sqrtRatioAX96;
  let sqrtRatioB = sqrtRatioBX96;

  if (sqrtRatioAX96 > sqrtRatioBX96) {
    sqrtRatioA = sqrtRatioBX96;
    sqrtRatioB = sqrtRatioAX96;
  }

  let amount0;
  let amount1;

  if (sqrtRatioX96 <= sqrtRatioAX96) {
    amount0 = entity.getAmount0ForLiquidity(sqrtRatioA, sqrtRatioB, liquidity);
  } else if (sqrtRatioX96 < sqrtRatioB) {
    amount0 = entity.getAmount0ForLiquidity(
      sqrtRatioX96,
      sqrtRatioB,
      liquidity,
    );
    amount1 = entity.getAmount1ForLiquidity(
      sqrtRatioA,
      sqrtRatioX96,
      liquidity,
    );
  } else {
    amount1 = entity.getAmount1ForLiquidity(sqrtRatioA, sqrtRatioB, liquidity);
  }

  return [amount0, amount1];
};

/// @notice Computes the amount of token0 for a given amount of liquidity and a price range
/// @param sqrtRatioAX96 A sqrt price representing the first tick boundary
/// @param sqrtRatioBX96 A sqrt price representing the second tick boundary
/// @param liquidity The liquidity being valued
/// @return amount0 The amount of token0
entity.getAmount0ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
  const leftShiftedLiquidity = JSBI.leftShift(liquidity, RESOLUTION);
  const sqrtDiff = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
  const multipliedRes = JSBI.multiply(leftShiftedLiquidity, sqrtDiff);
  const numerator = JSBI.divide(multipliedRes, sqrtRatioBX96);

  const amount0 = JSBI.divide(numerator, sqrtRatioAX96);

  return amount0;
};

entity.getAmount1ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
  const sqrtDiff = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
  const multipliedRes = JSBI.multiply(liquidity, sqrtDiff);
  const amount1 = JSBI.divide(multipliedRes, RESOLUTION);

  return amount1;
};
