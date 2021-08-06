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
const { tickPrice } = require('./tick-price');
const {
  getAmountsForCurrentLiquidity,
  getAmountsForLiquidityRange,
} = require('./liquidity');
const { getSqrtRatioAtTick, getTickAtSqrtRatio } = require('./tick-math');
const consts = require('./constants');

const api = (module.exports = sqrtPrice);

api.tickPrice = tickPrice;
api.sqrtPrice = sqrtPrice;

// Liquidity Functions
api.getAmountsForCurrentLiquidity = getAmountsForCurrentLiquidity;
api.getAmountsForLiquidityRange = getAmountsForLiquidityRange;

api.tickMath = {
  getSqrtRatioAtTick,
  getTickAtSqrtRatio,
};

api.constants = consts;

api.utils = {
  encodeSqrtRatioX96,
  sqrt,
  tickRange,
  expDecs,
  biConv,
};
