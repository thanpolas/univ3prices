/**
 * @fileoverview Functional context for chaining fraction calculating and
 *    formatting commands.
 * @see https://github.com/thanpolas/crypto-utils
 */

const { toSignificant, toFixed, toAuto } = require('@thanpolas/crypto-utils');

/**
 * Functional context for chaining commands.
 *
 * @param {Object<bigint>} fraction Fraction object containing the numerator
 *    and denominator.
 * @return {Object} Chainable context with formatting functions.
 */
module.exports = function chainContext(fraction) {
  return {
    toFixed: toFixed.bind(null, fraction),
    toSignificant: toSignificant.bind(null, fraction),
    toAuto: toAuto.bind(null, fraction),
    toFraction: () => fraction,
  };
};
