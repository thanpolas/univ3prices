const { getPrice, encodeSqrtRatioX96 } = require('../..');

describe('Uniswap V3 Prices', () => {
  describe('toSignificant test cases', () => {
    it('Price of token0 to token1', () => {
      const sqrtRatioX96 = encodeSqrtRatioX96(101e6, 100e18);

      const price = getPrice(6, 18, sqrtRatioX96).toSignificant(5);

      expect(price).toBeString();
      expect(price).toEqual('1.01');
    });
  });
});
