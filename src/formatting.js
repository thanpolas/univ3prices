/**
 * @fileoverview Converts Big Integers to human readable format.
 */

const Big = require('big.js');
const invariant = require('invariant');
const toFormat = require('toformat');
const Decimal = require('decimal.js');

const {
  Rounding,
  toSignificantRounding,
  toFixedRounding,
} = require('./rounding');

const DecimalFormat = toFormat(Decimal);
const BigFormat = toFormat(Big);

const formatting = (module.exports = {});

/**
 * Will convert the fraction of the two tokens into a significant representation.
 *
 * @param {Object<bigint>} fraction Fraction object containing the numerator
 *    and denominator.
 * @param {number=} significantDigits How many significant digits to use.
 * @param {Object=} format Formatting of the output.
 * @param {Rounding} rounding Desired rounding.
 * @return {string} The result.
 */
formatting.toSignificant = (
  fraction,
  significantDigits = 5,
  format = { groupSeparator: '' },
  rounding = Rounding.ROUND_HALF_UP,
) => {
  invariant(
    Number.isInteger(significantDigits),
    `${significantDigits} is not an integer.`,
  );
  invariant(significantDigits > 0, `${significantDigits} is not positive.`);

  const precision = significantDigits + 1;
  const roundingDecimal = toSignificantRounding[rounding];

  Decimal.set({ precision, rounding: roundingDecimal });

  const quotient = new DecimalFormat(fraction.numerator.toString())
    .div(fraction.denominator.toString())
    .toSignificantDigits(significantDigits);

  const res = quotient.toFormat(quotient.decimalPlaces(), format);

  return res;
};

/**
 * Will convert the fraction of the two tokens into a fixed representation.
 *
 * @param {Object<bigint>} fraction Fraction object containing the numerator
 *    and denominator.
 * @param {number=} decimalPlaces How many decimal places to use.
 * @param {Object=} format Formatting of the output.
 * @param {Rounding} rounding Desired rounding.
 * @return {string} The result.
 */
formatting.toFixed = (
  fraction,
  decimalPlaces = 5,
  format = { groupSeparator: '' },
  rounding = Rounding.ROUND_HALF_UP,
) => {
  invariant(
    Number.isInteger(decimalPlaces),
    `${decimalPlaces} is not an integer.`,
  );
  invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`);

  BigFormat.DP = decimalPlaces;
  BigFormat.RM = toFixedRounding[rounding];

  const res = new BigFormat(fraction.numerator.toString())
    .div(fraction.denominator.toString())
    .toFormat(decimalPlaces, format);

  return res;
};
