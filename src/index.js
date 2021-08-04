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

const { getPrice } = require('./univ3prices');
const { encodeSqrtRatioX96, sqrt } = require('./utils');
const { Rounding } = require('./rounding');
const { tickPrice } = require('./tick-price');
const { reserves, getAmountsForLiquidity } = require('./reserves');
const tickMath = require('./tick-math');
const consts = require('./constants');

const api = (module.exports = getPrice);

api.tickPrice = tickPrice;
api.encodeSqrtRatioX96 = encodeSqrtRatioX96;
api.sqrt = sqrt;
api.Rounding = Rounding;
api.reserves = reserves;
api.getAmountsForLiquidity = getAmountsForLiquidity;
api.tickMath = tickMath;
api.consts = consts;
