/**
 * @fileoverview Required Uniswap V3 constants.
 */

const JSBI = require('jsbi');
const { Rounding } = require('@thanpolas/crypto-utils');

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

/**
 * The minimum tick that can be used on any pool.
 */
consts.MIN_TICK = -887272;
/**
 * The maximum tick that can be used on any pool.
 */
consts.MAX_TICK = -consts.MIN_TICK;

/**
 * The sqrt ratio corresponding to the minimum tick that could be used on any pool.
 */
consts.MIN_SQRT_RATIO = JSBI.BigInt('4295128739');
/**
 * The sqrt ratio corresponding to the maximum tick that could be used on any pool.
 */
consts.MAX_SQRT_RATIO = JSBI.BigInt(
  '1461446703485210103287273052203988822378723970342',
);

/**
 * @enum {number} Normalized rounding for this package.
 */
consts.Rounding = Rounding;
