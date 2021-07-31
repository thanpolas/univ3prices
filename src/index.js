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

const { getPrice, Q96, Q192 } = require('./univ3prices');
const { encodeSqrtRatioX96, sqrt } = require('./utils');
const { Rounding } = require('./rounding');
const { tickPrice } = require('./tick-price');

const api = (module.exports = getPrice);

api.tickPrice = tickPrice;
api.encodeSqrtRatioX96 = encodeSqrtRatioX96;
api.sqrt = sqrt;
api.Rounding = Rounding;
api.Q96 = Q96;
api.Q192 = Q192;
