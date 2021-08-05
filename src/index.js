/**
 * Uniswap V3 Prices calculator.
 * Library to calculate Uniswap V3 ratios (prices) from token pairs.
 *
 * https://github.com/thanpolas/univ3-prices
 *
 * Copyright © Thanos Polychronakis
 * LICENSE on /LICENSE file.
 */

/**
 * @fileoverview Public API
 */

const { sqrtPrice } = require('./sqrt-price');
const {
  encodeSqrtRatioX96,
  sqrt,
  tickRange,
  biConv,
  expDecs,
} = require('./utils');
const { Rounding } = require('./rounding');
const { tickPrice } = require('./tick-price');
const {
  getAmountsForLiquidityFormatted,
  getAmountsForLiquidity,
} = require('./reserves');
const { getSqrtRatioAtTick, getTickAtSqrtRatio } = require('./tick-math');
const consts = require('./constants');

const api = (module.exports = sqrtPrice);

api.tickPrice = tickPrice;
api.sqrtPrice = sqrtPrice;

// Liquidity Functions
api.getAmountsForLiquidityFormatted = getAmountsForLiquidityFormatted;
api.getAmountsForLiquidity = getAmountsForLiquidity;

api.tickMath = {
  getSqrtRatioAtTick,
  getTickAtSqrtRatio,
};

api.consts = consts;

api.utils = {
  encodeSqrtRatioX96,
  sqrt,
  Rounding,
  tickRange,
  expDecs,
  biConv,
};
