const JSBI = require('jsbi');
const sqrtPrice = require('../..');
const subfix = require('../fixtures/subgraph-results.fix');

const { eth_usdt: ethusdtfix, susd_usdc: susdfix } = subfix;
const { encodeSqrtRatioX96 } = sqrtPrice.utils;
const { Rounding } = sqrtPrice.constants;

describe('Uniswap V3 sqrt price', () => {
  describe('toSignificant', () => {
    describe('Price', () => {
      it('Price of ETH USDT from subgraph', () => {
        const price = sqrtPrice(
          ethusdtfix.token0.decimals,
          ethusdtfix.token1.decimals,
          ethusdtfix.sqrtPrice,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('2061.1');
      });
      it('Price of ETH USDT from subgraph reversed', () => {
        const price = sqrtPrice(
          ethusdtfix.token0.decimals,
          ethusdtfix.token1.decimals,
          ethusdtfix.sqrtPrice,
          true,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('0.00048518');
      });

      it('Price of SUSD USDC from subgraph', () => {
        const price = sqrtPrice(
          susdfix.token0.decimals,
          susdfix.token1.decimals,
          susdfix.sqrtPrice,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('1.009');
      });
      it('Price of SUSD USDC from subgraph reversed', () => {
        const price = sqrtPrice(
          susdfix.token0.decimals,
          susdfix.token1.decimals,
          susdfix.sqrtPrice,
          true,
        ).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('0.99107');
      });

      it('Price of token0 to token1 for stables', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice(18, 6, sqrtRatioX96).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('1.01');
      });
      it('Price of token1 to token0 for stables', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice(18, 6, sqrtRatioX96, true).toSignificant(5);

        expect(price).toBeString();
        expect(price).toEqual('0.9901');
      });
      it('Price of token0 to token1 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(5);

        expect(price).toBeString();
        expect(price).toEqual('2');
      });
      it('Price of token1 to token0 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96, true).toSignificant(5);

        expect(price).toBeString();
        expect(price).toEqual('0.5');
      });
    });
    describe('Formatting', () => {
      it('Big number will not get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(5);

        expect(price).toBeString();
        expect(price).toEqual('2000000');
      });
      it('Big number will get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(5, {
          groupSeparator: ',',
        });

        expect(price).toBeString();
        expect(price).toEqual('2,000,000');
      });
    });
    describe('Rounding', () => {
      it('Will round UP to 5 digits (default)', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant();

        expect(price).toBeString();
        expect(price).toEqual('1.4286');
      });
      it('Will Round UP to 3 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(3);

        expect(price).toBeString();
        expect(price).toEqual('1.43');
      });
      it('Will Round UP to 2 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(2);

        expect(price).toBeString();
        expect(price).toEqual('1.4');
      });
      it('Will round DOWN', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(
          5,
          { groupSeparator: '' },
          Rounding.ROUND_DOWN,
        );

        expect(price).toBeString();
        expect(price).toEqual('1.4285');
      });
      it('Will round DOWN 3 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(
          3,
          { groupSeparator: '' },
          Rounding.ROUND_DOWN,
        );

        expect(price).toBeString();
        expect(price).toEqual('1.42');
      });
      it('Will round HALF_UP', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toSignificant(
          5,
          { groupSeparator: '' },
          Rounding.ROUND_HALF_UP,
        );

        expect(price).toBeString();
        expect(price).toEqual('1.4286');
      });
    });
  });
  describe('toFixed', () => {
    describe('Price', () => {
      it('Price of token0 to token1', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice(18, 6, sqrtRatioX96).toFixed(5);

        expect(price).toBeString();
        expect(price).toEqual('1.01000');
      });
      it('Price of token1 to token0', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

        const price = sqrtPrice(18, 6, sqrtRatioX96, true).toFixed(5);

        expect(price).toBeString();
        expect(price).toEqual('0.99010');
      });
      it('Price of token0 to token1 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(5);

        expect(price).toBeString();
        expect(price).toEqual('2.00000');
      });
      it('Price of token1 to token0 for arbitrary', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(200e18, 100e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96, true).toFixed(5);

        expect(price).toBeString();
        expect(price).toEqual('0.50000');
      });
    });
    describe('Formatting', () => {
      it('Big number will not get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(5);

        expect(price).toBeString();
        expect(price).toEqual('2000000.00000');
      });
      it('Big number will get formatted', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(2000000e18, 1e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(5, {
          groupSeparator: ',',
        });

        expect(price).toBeString();
        expect(price).toEqual('2,000,000.00000');
      });
    });
    describe('Rounding', () => {
      it('Will Round UP (default)', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed();

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
      it('Will Round UP 3 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(3);

        expect(price).toBeString();
        expect(price).toEqual('1.429');
      });
      it('Will Round UP 2 digits', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(2);

        expect(price).toBeString();
        expect(price).toEqual('1.43');
      });
      it('Will round DOWN', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(
          5,
          { groupSeparator: '' },
          Rounding.ROUND_DOWN,
        );

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
      it('Will round HALF_UP', () => {
        const sqrtRatioX96 = encodeSqrtRatioX96(10e18, 7e18);

        const price = sqrtPrice(18, 18, sqrtRatioX96).toFixed(
          5,
          { groupSeparator: '' },
          Rounding.ROUND_HALF_UP,
        );

        expect(price).toBeString();
        expect(price).toEqual('1.42857');
      });
    });
  });
  describe('toFraction()', () => {
    it('Validations and type checks', () => {
      const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

      const fraction = sqrtPrice(18, 6, sqrtRatioX96).toFraction();

      expect(fraction).toBeArray();
      const [numerator, denominator] = fraction;
      expect(numerator).toBeInstanceOf(JSBI);
      expect(denominator).toBeInstanceOf(JSBI);
    });
  });
});
