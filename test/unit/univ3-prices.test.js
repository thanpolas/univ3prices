const univ3Price = require('../..');

const { encodeSqrtRatioX96 } = univ3Price;

describe('Uniswap V3 Prices', () => {
  describe('toSignificant test cases', () => {
    it('Price of token0 to token1', () => {
      const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

      const price = univ3Price(6, 18, sqrtRatioX96).toSignificant(5);

      expect(price).toBeString();
      expect(price).toEqual('1.01');
    });
    it('Price of token1 to token0', () => {
      const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

      const price = univ3Price(6, 18, sqrtRatioX96, true).toSignificant(5);

      expect(price).toBeString();
      expect(price).toEqual('0.9901');
    });
  });
});
