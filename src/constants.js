/**
 * @fileoverview Required Uniswap V3 constants.
 */

const JSBI = require('jsbi');

const consts = (module.exports = {});

/** @const {number} RESOLUTION fixed point resolution  */
consts.RESOLUTION = JSBI.BigInt(96);

// constants used internally but not expected to be used externally
consts.NEGATIVE_ONE = JSBI.BigInt(-1);
consts.ZERO = JSBI.BigInt(0);
consts.ONE = JSBI.BigInt(1);
consts.TWO = JSBI.BigInt(2);

// used in liquidity amount math
consts.Q32 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(32));
consts.Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
consts.Q192 = JSBI.exponentiate(consts.Q96, JSBI.BigInt(2));

consts.MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);
