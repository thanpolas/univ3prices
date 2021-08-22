const JSBI = require('jsbi');
const { Rounding } = require('@thanpolas/crypto-utils');

const sqrtPrice = require('../..');
const subfix = require('../fixtures/subgraph-results.fix');
const {
  dai_weth: daiwethFix,
  usdc_weth: usdcwethFix,
} = require('../fixtures/univ3-pool-results');

const { eth_usdt: ethusdtfix, susd_usdc: susdfix } = subfix;
const { encodeSqrtRatioX96 } = sqrtPrice.utils;

describe('Uniswap V3 sqrt price', () => {
  describe('toSignificant', () => {
    describe('Price checks from LP contract', () => {
      it('Price of DAI/WETH', () => {
        const price = sqrtPrice(
          [daiwethFix.token0_decimals, daiwethFix.token1_decimals],
          daiwethFix.sqrtPrice,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('2610.3');
      });
      it('Price of USDC/WETH', () => {
        const price = sqrtPrice(
          [usdcwethFix.token0_decimals, usdcwethFix.token1_decimals],
          usdcwethFix.sqrtPrice,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('2749.4');
      });
    });

    describe('Price checks from subgraph', () => {
      it('Price of ETH/USDT from subgraph', () => {
        const price = sqrtPrice(
          [ethusdtfix.token0.decimals, ethusdtfix.token1.decimals],
          ethusdtfix.sqrtPrice,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('0.00048518');
      });
      it('Price of ETH/USDT from subgraph reversed', () => {
        const price = sqrtPrice(
          [ethusdtfix.token0.decimals, ethusdtfix.token1.decimals],
          ethusdtfix.sqrtPrice,
        ).toSignificant({ reverse: true });

        expect(price).toBeString();
        expect(price).toEqual('2061.1');
      });

      it('Price of SUSD/USDC from subgraph', () => {
        const price = sqrtPrice(
          [susdfix.token0.decimals, susdfix.token1.decimals],
          susdfix.sqrtPrice,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('0.99107');
      });
      it('Price of SUSD/USDC from subgraph reversed', () => {
        const price = sqrtPrice(
          [susdfix.token0.decimals, susdfix.token1.decimals],
          susdfix.sqrtPrice,
        ).toSignificant({ reverse: true });

        expect(price).toBeString();
        expect(price).toEqual('1.009');
      });
    });
    describe('Uniswap V3 SDK Test Suite', () => {
      it('Price of token0 to token1 for stables', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice([18, 6], sqrtRatioX96).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('0.9901');
      });
      it('Price of token1 to token0 for stables', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice([18, 6], sqrtRatioX96).toSignificant({
          reverse: true,
          decimalPlaces: 7,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.01');
      });
      it('Price of token0 to token1 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          decimalPlaces: 7,
        });

        expect(price).toBeString();
        expect(price).toEqual('0.5');
      });
      it('Price of token1 to token0 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          reverse: true,
          decimalPlaces: 7,
        });

        expect(price).toBeString();
        expect(price).toEqual('2');
      });
    });
    describe('Formatting', () => {
      it('Big number will not get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          reverse: true,
          decimalPlaces: 7,
        });

        expect(price).toBeString();
        expect(price).toEqual('2000000');
      });
      it('Big number will get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96, true).toSignificant({
          reverse: true,
          decimalPlaces: 7,
          format: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('2,000,000');
      });
    });
    describe('Rounding', () => {
      it('Will round UP to 5 digits (default)', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.4286');
      });
      it('Will Round UP to 3 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          decimalPlaces: 3,
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.43');
      });
      it('Will Round UP to 2 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          decimalPlaces: 2,
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.4');
      });
      it('Will round DOWN', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          decimalPlaces: 5,
          reverse: true,
          rounding: Rounding.ROUND_DOWN,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.4285');
      });
      it('Default rounding at 4 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          decimalPlaces: 4,
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.429');
      });
      it('Will round ROUND_DOWN 4 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toSignificant({
          decimalPlaces: 4,
          reverse: true,
          rounding: Rounding.ROUND_DOWN,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.428');
      });
    });
  });
  describe('toFixed', () => {
    describe('Price', () => {
      it('Price of token0 to token1', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice([18, 6], sqrtRatioX96).toFixed({
          decimalPlaces: 5,
        });

        expect(price).toBeString();
        expect(price).toEqual('0.99010');
      });
      it('Price of token1 to token0', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice([18, 6], sqrtRatioX96).toFixed({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.01000');
      });
      it('Price of token0 to token1 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed();

        expect(price).toBeString();
        expect(price).toEqual('0.50000');
      });
      it('Price of token1 to token0 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('2.00000');
      });
    });
    describe('Formatting', () => {
      it('Big number will not get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('2000000.00000');
      });
      it('Big number will get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
          format: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('2,000,000');
      });
    });
    describe('Rounding', () => {
      it('Will Round UP (default)', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
      it('Will Round UP 3 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
          decimalPlaces: 3,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.429');
      });
      it('Will Round UP 2 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
          decimalPlaces: 2,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.43');
      });
      it('Will round DOWN', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
          rounding: Rounding.ROUND_DOWN,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
      it('Will round HALF_UP', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toFixed({
          reverse: true,
          rounding: Rounding.ROUND_HALF_UP,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
    });
  });

  describe('toAuto', () => {
    describe('Price', () => {
      it('Default toAuto', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice([18, 6], sqrtRatioX96).toAuto();

        expect(price).toBeString();
        expect(price).toEqual('0.9901');
      });
      it('Price reversed', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice([18, 6], sqrtRatioX96).toAuto({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.01000');
      });
      it('Price of token0 to token1 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(20000000e18, 100e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toAuto();

        expect(price).toBeString();
        expect(price).toEqual('0.000005');
      });
      it('Price of token1 to token0 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(20000000e18, 100e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toAuto({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('200000.00000');
      });
      it('Ratio of 10/7', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toAuto();

        expect(price).toBeString();
        expect(price).toEqual('0.7');
      });
      it('Ratio of 10/7 reverse', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toAuto({
          reverse: true,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
      it('Ratio of 10/7 reverse - 3 decimals', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice([18, 18], sqrtRatioX96).toAuto({
          reverse: true,
          decimalPlaces: 3,
        });

        expect(price).toBeString();
        expect(price).toEqual('1.429');
      });
    });
  });

  describe('toFraction()', () => {
    it('Validations and type checks', () => {
      const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

      const fraction = sqrtPrice([18, 6], sqrtRatioX96).toFraction();

      expect(fraction).toBeArray();
      const [numerator, denominator] = fraction;
      expect(numerator).toBeInstanceOf(JSBI);
      expect(denominator).toBeInstanceOf(JSBI);
    });
  });
});
