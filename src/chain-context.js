/**
 * @fileoverview Functional context for chaining commands.
 */

const { toFixed, toSignificant } = require('./formatting');

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
    toScalar: () => fraction,
  };
};
