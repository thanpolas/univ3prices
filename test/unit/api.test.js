const univ3Prices = require('../..');

describe('API Surface Tests', () => {
  it('Exposes main function', () => {
    expect(univ3Prices).toBeFunction();
  });
  it('Exposes encodeSqrtRatioX96 function', () => {
    expect(univ3Prices.encodeSqrtRatioX96).toBeFunction();
  });
  it('Exposes only the expected properties', () => {
    expect(univ3Prices).toContainAllKeys([
      'encodeSqrtRatioX96',
      'sqrt',
      'Rounding',
      'Q96',
      'Q192',
    ]);
  });
  it('Exposes sqrt function', () => {
    expect(univ3Prices.sqrt).toBeFunction();
  });
  it('Exposes Rounding Enum', () => {
    expect(univ3Prices.Rounding).toBeObject();
  });
  it('Rounding Enum has expected values', () => {
    expect(univ3Prices.Rounding.ROUND_DOWN).toEqual(0);
    expect(univ3Prices.Rounding.ROUND_HALF_UP).toEqual(1);
    expect(univ3Prices.Rounding.ROUND_UP).toEqual(2);
  });
  it('Rounding Enum has expected keys', () => {
    expect(univ3Prices.Rounding).toContainAllKeys([
      'ROUND_DOWN',
      'ROUND_HALF_UP',
      'ROUND_UP',
    ]);
  });
  it('Exposes Q96 constant', () => {
    expect(univ3Prices.Q96).toBeArray();
  });
  it('Exposes Q192 constant', () => {
    expect(univ3Prices.Q192).toBeArray();
  });
});
