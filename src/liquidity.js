/**
 * @fileoverview Calculates the reserves given the liquidity value and sqrt values.
 */

const JSBI = require('jsbi');
const { toFixed } = require('@thanpolas/crypto-utils');

// const chainContext = require('./chain-context');
const { RESOLUTION, Q96 } = require('./constants');
const { getSqrtRatioAtTick, getTickAtSqrtRatio } = require('./tick-math');
const { tickRange, expDecs, biConv } = require('./utils');

const entity = (module.exports = {});

/**
 * Calculates the reserves of tokens based on the current tick value and formats
 * appropriately given the decimals of each token.
 *
 * @param {Array<number|string>} tokenDecimals Array tuple of token decimals.
 * @param {string} liquidityStr The liquidity value.
 * @param {string} sqrtPriceStr The sqrt price value.
 * @param {string} tickSpacing The spacing between the ticks.
 * @param {Object} optOpts Calculation and formatting options.
 * @param {number=} optOpts.tickStep How many tick steps wide to capture liquidity.
 * @param {Object=} optOpts.token0Opts Token 0 liquidity crypto-utils formatting options.
 * @param {Object=} optOpts.token1Opts Token 1 liquidity crypto-utils formatting options.
 * @return {Array<string>} A tuple with the reserves of token0 and token1.
 */
entity.getAmountsForCurrentLiquidity = (
  tokenDecimals,
  liquidityStr,
  sqrtPriceStr,
  tickSpacing,
  optOpts = {},
) => {
  const { tickStep, token0Opts, token1Opts } = optOpts;

  const [dec0, dec1] = tokenDecimals;

  // Exponentiate the decimals
  const tok0Dec = expDecs(dec0);
  const tok1Dec = expDecs(dec1);

  // Convert to bigint
  const sqrtPrice = biConv(sqrtPriceStr);
  const liquidity = biConv(liquidityStr);

  // Get tick value from sqrt
  const tick = getTickAtSqrtRatio(sqrtPrice);

  // Get the tick range to calculate liquidity for
  const [tickLow, tickHigh] = tickRange(tick, tickSpacing, tickStep);

  // Get the sqrtRatio for the tick range (low and high tick).
  const sqrtA = getSqrtRatioAtTick(tickLow);
  const sqrtB = getSqrtRatioAtTick(tickHigh);

  // Calculate liquidity for both tokens
  const reserves = entity.getAmountsForLiquidityRange(
    sqrtPrice,
    sqrtA,
    sqrtB,
    liquidity,
  );

  const [token0RawLiquidity, token1RawLiquidity] = reserves;

  const fraction0 = [token0RawLiquidity, tok0Dec];
  const fraction1 = [token1RawLiquidity, tok1Dec];

  const reservesFormatted = [
    toFixed(fraction0, token0Opts),
    toFixed(fraction1, token1Opts),
  ];

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
entity.getAmountsForLiquidityRange = (
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
 * @param {bigint} sqrtRatioAX96 A sqrt price representing the first tick boundary.
 * @param {bigint} sqrtRatioBX96 A sqrt price representing the second tick boundary.
 * @param {bigint} liquidity The liquidity being valued.
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
 * @param {bigint} sqrtRatioAX96 A sqrt price representing the first tick boundary.
 * @param {bigint} sqrtRatioBX96 A sqrt price representing the second tick boundary.
 * @param {bigint} liquidity The liquidity being valued.
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
