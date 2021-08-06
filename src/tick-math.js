/* eslint-disable no-bitwise */
/**
 * @fileoverview Utility functions for converting tick to sqrt and the opposite.
 */

const invariant = require('invariant');
const JSBI = require('jsbi');

const {
  Q32,
  ZERO,
  ONE,
  TWO,
  MaxUint256,
  MIN_TICK,
  MAX_TICK,
  MIN_SQRT_RATIO,
  MAX_SQRT_RATIO,
} = require('./constants');

const entity = (module.exports = {});

entity.POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow) => [
  pow,
  JSBI.exponentiate(TWO, JSBI.BigInt(pow)),
]);

/**
 * Multiplies and right shifts.
 *
 * @param {bigint} val The multiplier.
 * @param {string} mulBy Multiply by.
 * @return {bigint}
 */
function mulShift(val, mulBy) {
  return JSBI.signedRightShift(
    JSBI.multiply(val, JSBI.BigInt(mulBy)),
    JSBI.BigInt(128),
  );
}

/**
 * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is
 * computed as sqrt(1.0001)^tick
 *
 * @param {string} tick the tick for which to compute the sqrt ratio.
 * @return {bigint} The SQRT value.
 */
entity.getSqrtRatioAtTick = (tick) => {
  invariant(
    tick >= MIN_TICK && tick <= MAX_TICK && Number.isInteger(tick),
    'TICK',
  );
  const absTick = tick < 0 ? tick * -1 : tick;

  let ratio =
    (absTick & 0x1) !== 0
      ? JSBI.BigInt('0xfffcb933bd6fad37aa2d162d1a594001')
      : JSBI.BigInt('0x100000000000000000000000000000000');
  if ((absTick & 0x2) !== 0) {
    ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
  }
  if ((absTick & 0x4) !== 0) {
    ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
  }
  if ((absTick & 0x8) !== 0) {
    ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
  }
  if ((absTick & 0x10) !== 0) {
    ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
  }
  if ((absTick & 0x20) !== 0) {
    ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
  }
  if ((absTick & 0x40) !== 0) {
    ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
  }
  if ((absTick & 0x80) !== 0) {
    ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
  }
  if ((absTick & 0x100) !== 0) {
    ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
  }
  if ((absTick & 0x200) !== 0) {
    ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
  }
  if ((absTick & 0x400) !== 0) {
    ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
  }
  if ((absTick & 0x800) !== 0) {
    ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
  }
  if ((absTick & 0x1000) !== 0) {
    ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
  }
  if ((absTick & 0x2000) !== 0) {
    ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
  }
  if ((absTick & 0x4000) !== 0) {
    ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
  }
  if ((absTick & 0x8000) !== 0) {
    ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
  }
  if ((absTick & 0x10000) !== 0) {
    ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
  }
  if ((absTick & 0x20000) !== 0) {
    ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
  }
  if ((absTick & 0x40000) !== 0) {
    ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
  }
  if ((absTick & 0x80000) !== 0) {
    ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');
  }

  if (tick > 0) {
    ratio = JSBI.divide(MaxUint256, ratio);
  }

  // back to Q96
  const result = JSBI.greaterThan(JSBI.remainder(ratio, Q32), ZERO)
    ? JSBI.add(JSBI.divide(ratio, Q32), ONE)
    : JSBI.divide(ratio, Q32);

  return result;
};

/**
 * Returns the tick corresponding to a given sqrt ratio,
 * s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
 * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
 *
 * @param {string} sqrtRatioX96 the sqrt ratio as a Q64.96 for which to
 *    compute the tick.
 * @return {bigint} JSBI value of the tick.
 */
entity.getTickAtSqrtRatio = (sqrtRatioX96) => {
  const sqrtRatio = JSBI.BigInt(sqrtRatioX96);
  invariant(
    JSBI.greaterThanOrEqual(sqrtRatio, MIN_SQRT_RATIO) &&
      JSBI.lessThan(sqrtRatio, MAX_SQRT_RATIO),
    'SQRT_RATIO',
  );

  const sqrtRatioX128 = JSBI.leftShift(sqrtRatio, JSBI.BigInt(32));

  const msb = entity.mostSignificantBit(sqrtRatioX128);

  let r;
  if (JSBI.greaterThanOrEqual(JSBI.BigInt(msb), JSBI.BigInt(128))) {
    r = JSBI.signedRightShift(sqrtRatioX128, JSBI.BigInt(msb - 127));
  } else {
    r = JSBI.leftShift(sqrtRatioX128, JSBI.BigInt(127 - msb));
  }

  let log_2 = JSBI.leftShift(
    JSBI.subtract(JSBI.BigInt(msb), JSBI.BigInt(128)),
    JSBI.BigInt(64),
  );

  for (let i = 0; i < 14; i += 1) {
    r = JSBI.signedRightShift(JSBI.multiply(r, r), JSBI.BigInt(127));
    const f = JSBI.signedRightShift(r, JSBI.BigInt(128));
    log_2 = JSBI.bitwiseOr(log_2, JSBI.leftShift(f, JSBI.BigInt(63 - i)));
    r = JSBI.signedRightShift(r, f);
  }

  const log_sqrt10001 = JSBI.multiply(
    log_2,
    JSBI.BigInt('255738958999603826347141'),
  );

  const tickLow = JSBI.toNumber(
    JSBI.signedRightShift(
      JSBI.subtract(
        log_sqrt10001,
        JSBI.BigInt('3402992956809132418596140100660247210'),
      ),
      JSBI.BigInt(128),
    ),
  );
  const tickHigh = JSBI.toNumber(
    JSBI.signedRightShift(
      JSBI.add(
        log_sqrt10001,
        JSBI.BigInt('291339464771989622907027621153398088495'),
      ),
      JSBI.BigInt(128),
    ),
  );

  let result = tickLow;

  if (
    tickLow !== tickHigh &&
    JSBI.lessThanOrEqual(entity.getSqrtRatioAtTick(tickHigh), sqrtRatioX96)
  ) {
    result = tickHigh;
  }

  return result;
};

/**
 * Calculates the most significant bit.
 *
 * @param {bigint} x The value to calculate for.
 * @return {number} The most significant bit.
 */
entity.mostSignificantBit = (x) => {
  invariant(JSBI.greaterThan(x, ZERO), 'ZERO');
  invariant(JSBI.lessThanOrEqual(x, MaxUint256), 'MAX');

  let msb = 0;
  for (const [power, min] of entity.POWERS_OF_2) {
    if (JSBI.greaterThanOrEqual(x, min)) {
      x = JSBI.signedRightShift(x, JSBI.BigInt(power));
      msb += power;
    }
  }
  return msb;
};
