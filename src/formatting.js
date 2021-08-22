/**
 * @fileoverview Converts Big Integers to human readable format.
 * @see https://github.com/thanpolas/crypto-utils
 */

const { toSignificant, toFixed, toAuto } = require('@thanpolas/crypto-utils');

const formatting = (module.exports = {});

formatting.toSignificant = toSignificant;
formatting.toFixed = toFixed;
formatting.toAuto = toAuto;
