/**
 * @fileoverview Constants of rounding for big.js and decimal.
 */

const Decimal = require('decimal.js');
const Big = require('big.js');

const round = (module.exports = {});

/**
 * @enum {number} Normalized rounding for this package.
 */
round.Rounding = {
  ROUND_DOWN: 0,
  ROUND_HALF_UP: 1,
  ROUND_UP: 2,
};

/**
 * @enum {number} Transpose this package's rounding to Decimal.js rounding.
 */
round.toSignificantRounding = {
  [round.Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [round.Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [round.Rounding.ROUND_UP]: Decimal.ROUND_UP,
};

/**
 * @enum {number} Transpose this package's rounding to Big.js rounding.
 */
round.toFixedRounding = {
  [round.Rounding.ROUND_DOWN]: Big.roundDown,
  [round.Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
  [round.Rounding.ROUND_UP]: Big.roundUp,
};
