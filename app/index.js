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
 * @fileOverview Public API
 */

const { getPrice } = require('./univ3-price');
const { encodeSqrtRatioX96, sqrt } = require('./utils');

const api = (module.exports = getPrice);

api.encodeSqrtRatioX96 = encodeSqrtRatioX96;
api.sqrt = sqrt;
