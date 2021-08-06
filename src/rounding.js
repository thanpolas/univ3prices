/**
 * @fileoverview Constants of rounding for big.js and decimal.
 */

const Decimal = require('decimal.js');
const Big = require('big.js');

const { Rounding } = require('./constants');

const consts = (module.exports = {});

/**
 * @enum {number} Transpose this package's rounding to Decimal.js rounding.
 */
consts.toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
};

/**
 * @enum {number} Transpose this package's rounding to Big.js rounding.
 */
consts.toFixedRounding = {
  [Rounding.ROUND_DOWN]: Big.roundDown,
  [Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
  [Rounding.ROUND_UP]: Big.roundUp,
};
