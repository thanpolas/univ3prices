const univ3Prices = require('../..');

describe('API Surface Tests', () => {
  describe('Properties', () => {
    it('Exposes only the expected properties at root level', () => {
      expect(univ3Prices).toContainAllKeys([
        'sqrtPrice',
        'tickPrice',
        'getAmountsForCurrentLiquidity',
        'getAmountsForLiquidityRange',
        'tickMath',
        'constants',
        'utils',
      ]);
    });
    it('Exposes only the expected properties for tickMath', () => {
      expect(univ3Prices.tickMath).toContainAllKeys([
        'getSqrtRatioAtTick',
        'getTickAtSqrtRatio',
      ]);
    });
    it('Exposes only the expected properties for constants', () => {
      expect(univ3Prices.constants).toContainAllKeys([
        'RESOLUTION',
        'NEGATIVE_ONE',
        'ZERO',
        'ONE',
        'TWO',
        'Q32',
        'Q96',
        'Q192',
        'MaxUint256',
        'MIN_TICK',
        'MAX_TICK',
        'MIN_SQRT_RATIO',
        'MAX_SQRT_RATIO',
        'Rounding',
      ]);
    });
    it('Exposes only the expected properties for utils', () => {
      expect(univ3Prices.utils).toContainAllKeys([
        'encodeSqrtRatioX96',
        'sqrt',
        'tickRange',
        'expDecs',
        'biConv',
      ]);
    });
  });
  describe('Check Types', () => {
    it('Default export is a function', () => {
      expect(univ3Prices).toBeFunction();
    });

    it('sqrtPrice is a function', () => {
      expect(univ3Prices.sqrtPrice).toBeFunction();
    });
    it('tickPrice is a function', () => {
      expect(univ3Prices.tickPrice).toBeFunction();
    });
    it('getAmountsForCurrentLiquidity is a function', () => {
      expect(univ3Prices.getAmountsForCurrentLiquidity).toBeFunction();
    });
    it('getAmountsForLiquidityRange is a function', () => {
      expect(univ3Prices.getAmountsForLiquidityRange).toBeFunction();
    });

    it('tickMath.getSqrtRatioAtTick is a function', () => {
      expect(univ3Prices.tickMath.getSqrtRatioAtTick).toBeFunction();
    });
    it('tickMath.getTickAtSqrtRatio is a function', () => {
      expect(univ3Prices.tickMath.getTickAtSqrtRatio).toBeFunction();
    });

    it('utils.encodeSqrtRatioX96 is a function', () => {
      expect(univ3Prices.utils.encodeSqrtRatioX96).toBeFunction();
    });
    it('utils.sqrt is a function', () => {
      expect(univ3Prices.utils.sqrt).toBeFunction();
    });
    it('utils.tickRange is a function', () => {
      expect(univ3Prices.utils.tickRange).toBeFunction();
    });
    it('utils.expDecs is a function', () => {
      expect(univ3Prices.utils.expDecs).toBeFunction();
    });
    it('utils.biConv is a function', () => {
      expect(univ3Prices.utils.biConv).toBeFunction();
    });
  });

  describe('Check Values', () => {
    it('Rounding Enum has expected values', () => {
      expect(univ3Prices.constants.Rounding.ROUND_DOWN).toEqual(1);
      expect(univ3Prices.constants.Rounding.ROUND_HALF_UP).toEqual(4);
      expect(univ3Prices.constants.Rounding.ROUND_UP).toEqual(0);
    });
  });
});
