# UniV3Prices

> A Node.js library to calculate [Uniswap V3][univ3] ratios (prices) and liquidity (reserves).

[![NPM Version][npm-image]][npm-url]
[![CircleCI][circle-image]][circle-url]
[![codecov](https://codecov.io/gh/thanpolas/univ3prices/branch/main/graph/badge.svg?token=XKLZG037MA)](https://codecov.io/gh/thanpolas/univ3prices)
[![Discord](https://img.shields.io/discord/847075821276758096?label=discord&color=CBE9F0)](https://discord.gg/GkyEqzJWEY)
[![Twitter Follow](https://img.shields.io/twitter/follow/thanpolas.svg?label=thanpolas&style=social)](https://twitter.com/thanpolas)

## <br />

<br />

> Check out the other Uniswap and crypto libraries, that depend on this library and this library depends on:
>
> ☎️ [@thanpolas/uniswap-chain-queries][uni-queries] for fetching on-chain data for ERC20 tokens, Uniswap V2 (and clones) and Uniswap V3.
> <br />🔧 [@thanpolas/crypto-utils][crypto-utils] for calculating and formatting tokens and fractions.

## <br />

<br />

## Features

This library will allow you to:

-   [Calculate price based on the sqrtPrice Value][sqrtprice].
-   [Calculate price based on the current tick Value][tickprice].
-   [Calculate amounts of tokens (reserves) for the current tick of a pool][reserves].
-   [Tick Math functions for converting tick to sqrt and vice versa][tick-math].
-   [Provide utility functions to work with Uniswap V3][utilities].
-   [Various constants to work with Uniswap V3][constants].

## Install

Install the module using NPM:

```
npm install @thanpolas/univ3prices --save
```

## Quick Start

```js
const univ3prices = require('@thanpolas/univ3prices');

const price = univ3prices([USDC.decimals, USDT.decimals], sqrtPrice).toAuto();

console.log(price);
// "1.00212"
```

## sqrtPrice(tokenDecimals, sqrtRatioX96)

> The default function; calculates [Uniswap V3][univ3] Liquidity Pool (LP) ratios (prices) for Token Pairs.

-   `tokenDecimals` **{Array<number|string>}** An Array tuple with 2 elements, the token0 and token1 decimal place values.
-   `sqrtPrice` **{string}** The Square Root price value of the LP.

ℹ️ :: This is the default function available by directly requiring the library (`const uniV3Prices = require('univ3prices')`)
or as a property (`const { sqrtPrice } = require('univ3prices')`).

ℹ️ :: See the [How to Get the sqrtPrice and Tick values][get-sqrt-tick-values] for a guide on how to get those values.

The `sqrtPrice()` returns an object that contains four functions depending on the output type you wish to have. The calculation functions are from the [crypto-utils][crypto-utils], find a brief description below.

### toAuto(optOptions)

Does automatic decimal calculation and applies appropriate function. If result is above 1 then toFixed() is applied, if under 1 then toSignificant() is applied. [View toAuto() documentation on crypto-utils][crypto-utils-toauto].

-   `optOptions` **{Object=}** Calculation and Formatting options from the [crypto-utils][crypto-utils-options] package.
-   **Returns** `{string}` an optimally formatted value.

```js
// prepare a sqrtPrice value, by emulating a 10 / 7 division.
const sqrtPrice = encodeSqrtRatioX96(10e18, 7e18);

univ3Price([18, 18], sqrtPrice).toAuto();
// '0.7'

univ3Price([18, 18], sqrtPrice).toAuto({ reverse: true });
// '1.42857'

univ3Price([18, 18], sqrtPrice).toSignificant({
    reverse: true,
    decimalPlaces: 3,
});
// '1.439'
```

### toSignificant(optOptions)

calculates the value to significant digits. [View the toSignificant() documentation on crypto-utils][crypto-utils-tosignificant]

-   `optOptions` **{Object=}** Calculation and Formatting options from the [crypto-utils][crypto-utils-options] package.
-   **Returns** `string`, the last significant decimals, default 5.

#### toSignificant Examples - Defaults

```js
// prepare a sqrtPrice value, by emulating a 7 / 10 division.
const sqrtPrice = encodeSqrtRatioX96(7e18, 10e18);

univ3Price([18, 18], sqrtPrice).toSignificant();
// '1.4286'

univ3Price([18, 18], sqrtPrice).toSignificant({ decimalPlaces: 3 });
// '1.43'

univ3Price([18, 18], sqrtPrice).toSignificant({ decimalPlaces: 2 });
// '1.4'
```

### toFixed(optOptions)

Calculates to fixed decimals. [View the toSignificant() documentation on crypto-utils][crypto-utils-tofixed]

-   `optOptions` **{Object=}** Calculation and Formatting options from the [crypto-utils][crypto-utils-options] package.
-   **Returns** `string`, ration with fixed decimals, default 5.

#### toFixed Examples

```js
// prepare a sqrtPrice value, by emulating a 7 / 10 division.
const sqrtPrice = encodeSqrtRatioX96(7e18, 10e18);
// and a sqrtPrice value emulating  20000000 / 1  division.
const sqrtPrice_20m = encodeSqrtRatioX96(20000000e18, 1e18);

univ3Price([18, 18], sqrtPrice).toFixed();
// '1.42857'

univ3Price([18, 18], sqrtPrice).toFixed({ decimalPlaces: 3 });
// '1.429'

univ3Price([18, 18], sqrtPrice).toFixed({ decimalPlaces: 2 });
// '1.43'

// This time use the 20m ratio
univ3Price([18, 18], sqrtPrice_20m).toFixed({ decimalPlaces: 2 });
// '20000000.00'
```

### toFraction()

Returns the raw fraction tuple Array; contains the numerator and denominator in [BigInt type][jsbi] of the token pairs.

#### toFraction() Examples

```js
const JSBI = require('jsbi');
// prepare a sqrtPrice value, by emulating a 10 / 7 division.
const sqrtPrice = encodeSqrtRatioX96(10e18, 7e18);

const fraction = univ3Price([18, 18], sqrtPrice).toFraction();

const [numerator, denominator] = fraction;

numerator instanceOf JSBI; // true
denominator instanceOf JSBI; // true
```

---

## How to get the sqrtPrice and tick Values From Uniswap

In regards to the `sqrtPrice` and `tick` values. there are two primary ways to get it:

### Using the Liquidity Pool Contract

Query the Liquidity Pool contract of interest and [use the `slot0()` method][slot0].

This method will return a collection of properties, the ones you care about is
`sqrtPriceX96` or `tick`.

### Using the Subgraph

Use the [Uniswap V3 Subgraph][univ3graph] that is publicly available and fetch
the `sqrtPrice` or `tick` property from the `Pool` schema.

---

## univ3prices.tickPrice(tokenDecimals, tick)

> calculates [Uniswap V3][univ3] Liquidity Pool (LP) ratios (prices) for Token Pairs using the current tick value.

-   `tokenDecimals` **{Array<number|string>}** An Array tuple with 2 elements, the token0 and token1 decimal place values.
-   `tick` **{string}** The current tick value.

ℹ️ :: See the [How to Get the sqrtPrice and Tick values][get-sqrt-tick-values] for a guide on how to get those values.

The `univ3prices.tickPrice()` returns an object that contains four functions depending on the output type you wish to have, and has the exact same functions as the default function:

-   [toAuto()][toauto].
-   [toSignificant()][tosignificant].
-   [toFixed()][tofixed].
-   [toFraction()][tofraction].

---

## univ3prices.getAmountsForCurrentLiquidity(tokenDecimals, liquidity, sqrtPrice, tickSpacing, optOpts)

> Calculates the reserves for the current sqrt price value.

-   `tokenDecimals` **{Array<number|string>}** An Array tuple with 2 elements, the token0 and token1 decimal place values.
-   `liquidity` **{string}** The liquidity value of the LP.
-   `tickSpacing` **{string}** The tick spacing value of the LP.
-   `optOptions` **{Object=}** A set of optional options:

    -   `tickStep` **{number=}** Optionally, set how many tick steps of liquidity range should be calculated (default: 0).
    -   `token0Opts` **{Object=}** Calculation and formatting options for the token0 reserves, [see available options on the crypto-utils package.][crypto-utils-options].
    -   `token1Opts` **{Object=}** Calculation and formatting options for the token1 reserves, [see available options on the crypto-utils package.][crypto-utils-options].

-   **Returns** **{Array<string>}** A tuple array containing the amount of each token in the defined liquidity range.

ℹ️ :: This function is a wrapper to [`getAmountsForLiquidityRange()`][getamountsforliquidityrange], will automatically calculate the liquidity range expressed as `sqrtRatioAX96` and `sqrtRatioBX96`.

### Examples for univ3prices.getAmountsForCurrentLiquidity

Standard example:

```js
const tokenDecimals = [
    '18', // decimals of DAI
    '18', // decimals of WETH
];
// Get the reserves for the DAI/WETH Liquidity Pool.
const [token0Reserves, token1Reserves] = getAmountsForCurrentLiquidity(
    tokenDecimals,
    '2830981547246997099758055', // Current liquidity value of the pool
    '1550724133884968571999296281', // Current sqrt price value of the pool
    '60', // the tickSpacing value from the pool
);
// The total amount of DAI available in this liquidity range
expect(token0Reserves).toEqual('116596.90182');
// The total amount of WETH available in this liquidity range
expect(token1Reserves).toEqual('121.40391');
```

Widening the liquidity range by having a step of 5:

```js
// Get the reserves for the DAI/WETH Liquidity Pool.
const [token0Reserves, token1Reserves] = getAmountsForCurrentLiquidity(
    tokenDecimals,
    '2830981547246997099758055', // Current liquidity value of the pool
    '1550724133884968571999296281', // Current sqrt price value of the pool
    '60', // the tickSpacing value from the pool
    {tickStep: 5} // Choose 5 steps of tickSpacing (60 * 5) for low and high tick values.
);
// The total amount of DAI available in this liquidity range
expect(token0Reserves).toEqual('2268131.86622');
// The total amount of WETH available in this liquidity range
expect(token1Reserves).toEqual('944.51034');
});
```

### Where to Find The Values for the Liquidity Function

Query directly the [Liquidity Pool contract you care about (i.e. this is the DAI/WETH pool)][dai-weth-pool] and call the functions:

-   `slot0()` To get a list of values including the `sqrtPriceX96`.
-   `liquidity()` To get the liquidity value.
-   `tickSpacing()` To get the tick spacing value.

---

## univ3prices.getAmountsForLiquidityRange(sqrtPrice, sqrtPriceA, sqrtPriceB, liquidity)

> Calculates the reserves for a range of sqrt price.

-   `sqrtPrice` **{string}** The Square Root price value of the LP.
-   `sqrtPriceA` **{string}** The Square Root price representing the low tick boundary.
-   `sqrtPriceB` **{string}** The Square Root price representing the high tick boundary.
-   `liquidity` **{string}** The liquidity value.
-   **Returns** **{Array<string>}** A tuple array containing the amount of each token in the defined liquidity range.

### Examples for univ3prices.getAmountsForLiquidityRange

```js
const [amount0, amount1] = getAmountsForLiquidityRange(
    encodePriceSqrt(1, 1), // generate sqrt price for range
    encodePriceSqrt(100, 110),
    encodePriceSqrt(110, 100),
    2148,
);

expect(Number(amount0)).toEqual(99); // Amount of token0
expect(Number(amount1)).toEqual(99); // Amount of token1
```

---

## Tick Math Functions

### univ3prices.tickMath.getSqrtRatioAtTick(tick)

> Calculates the sqrt ratio at the given tick.

-   `tick` **{string}** The tick value to calculate the sqrt ratio for.
-   **Returns** **{string}** The sqrt ratio.

### univ3prices.tickMath.getTickAtSqrtRatio(sqrtPrice)

> Calculates the tick at the given sqrt ratio.

-   `sqrtPrice` **{string}** The sqrt price to calculate the tick for.
-   **Returns** **{string}** The tick.

---

## Utility Functions

The following utility functions are available in the `univ3prices.utils` path:

-   `encodeSqrtRatioX96(amount0, amount1)` Convert a value pair to sqrt price.
-   `sqrt(value)` Computes the floor(sqrt(value)).
-   `tickRange(tick, tickSpacing, optTickStep)` Will calculate the low and high tick ranges for a given tick, optionally multiplying the spacing with the step for a wider range.
-   `expDecs(decimals)` Will return the exponent of the given decimals number.
-   `biConv(value)` Will safely convert any value to JSBI and not touch values that are of JSBI type.

---

## Constants

The following constants are available in the `univ3prices.constants` path:

-   `RESOLUTION` :: Fixed point resolution of `96` as a bigint.
-   `NEGATIVE_ONE` :: `-1` as a bigint.
-   `ZERO` :: `0` as a bigint.
-   `ONE` :: `1` as a bigint.
-   `TWO` :: `2` as a bigint.
-   `Q32` :: Power of 2 at `32`.
-   `Q96` :: Power of 2 at `96`.
-   `Q192` :: Power of 2 at `192`.
-   `MaxUint256` :: Maximum signed integer value.
-   `MIN_TICK` :: Minimum tick value.
-   `MAX_TICK` :: Maximum tick value.
-   `MIN_SQRT_RATIO` :: Minimum sqrt price (ratio) value.
-   `MAX_SQRT_RATIO` :: Maximum sqrt price (ratio) value.
-   `Rounding` :: The [Rounding enumeration from the crypto-utils package][crypto-utils-rounding].

---

# Acknowledgements & Credits

This library has been a study and break down, to understand how Uniswap V3 works. It acts both as a library for you to use and a way for you to understand, in simpler terms, how price is calculated.

In particular, the [Uniswap V3 SDK's Pool Class][uni-pool] and the [Uniswap SDK Core's Price][uni-price] and [Fraction][uni-fraction] classes were reverse engineered and rewritten in a functional manner. Most of the tests where also ported directly from the excellently tested SDK and Core packages.

Thank you goes to [JNP][jnp] who helped me understand how to work with tick and sqrt ranges.

Thank you goes to [Georgios Konstantopoulos][gakonst] who helped me with liquidity calculations and code review.

Finally, thank you goes to [Jorropo.eth][jorropo] who has accompanied and helped me in the weeks long journey of discovering how to calculate Uniswap's V3 sqrt ratios, on Uniswap's Discord. He also gave the following excellent explanation as to why the Token Pair reserves are square rooted:

> This is so the difference gets exponentially written.
>
> Let's assume ticks were just 100$ in size, so you have one from 0-100, 100-200, ...
> A token that is price at 250$ would need to do +20% in price to cross a tick.
> But a token priced 25050$ it's bearly +0.2%.
>
> Having them SQRT makes the ratio constant.
> So in any cases it's just let's say any 1% of price change, cross a tick.
>
> This spreads them each 1% appart (so fewer and fewer ticks), instead of each 100$ appart.

# Maintenance & Development

## Update Node Version

When a new node version should be supported, updated the following:

-   `/package.json`
-   `/.nvmrc`
-   `/.circleci/config.yml`

## Releasing

1. Update the changelog bellow ("Release History").
1. Ensure you are on master and your repository is clean.
1. Type: `npm run release` for patch version jump.
    - `npm run release:minor` for minor version jump.
    - `npm run release:major` for major major jump.

## Release History

-   **v3.0.2**, _07 Sep 2021_
    -   JSBI 3.2.1 [also had an issue when used on the browser environment](https://github.com/GoogleChromeLabs/jsbi/issues/70) so had to upgrade to `^3.2.2` to ensure compatibility.
-   **v3.0.1**, _06 Sep 2021_
    -   Updated all dependencies to latest and especially jsbi to `^3.2.1` so users won't suffer from the broken [3.2.0 release](https://github.com/GoogleChromeLabs/jsbi/issues/68).
-   **v3.0.0**, _22 Aug 2021_
    -   **Breaking** Changed signature of `getAmountsForCurrentLiquidity()``, it now uses a tuple for the decimals and added formatting options for the result. By default liquidity values will now have 5 decimal places instead of 1
    -   **Breaking** Changed signature of `sqrtPrice()` and `tickPrice()`, they now use a tuple for the decimals and reversing the price has been decoupled to formatting.
    -   **Breaking** Decoupled and replaced fraction calculation and formatting functions to [crypto-utils][crypto-utils] package (`toSignificant()` and `toFixed()` functions).
    -   Replaced internal fraction and formatting functions with [crypto-utils][crypto-utils] package.
    -   Fixed bug with `priceRange()` utility that affected the liquidity calculation when the `tickSpacing` argument was used, thank you [@sydneyhenrard](https://github.com/sydneyhenrard).
-   **v2.0.1**, _06 Aug 2021_
    -   Fixed order of price calculation for `sqrtPrice()`.
-   **v2.0.0**, _06 Aug 2021_
    -   Implemented the liquidity calculation functions `getAmountsForCurrentLiquidity()` and `getAmountsForLiquidityRange()`.
    -   Implemented Tick Math functions at `tickMath.getSqrtRatioAtTick()` and `tickMath.getTickAtSqrtRatio`.
    -   Added `sqrtPrice` function on the API (same as the default export).
    -   New constant values added (`ZERO`, `ONE`, `TWO`, `MaxUint256`, `MIN_TICK`, `MAX_TICK`, `MIN_SQRT_RATIO`, `MAX_SQRT_RATIO`).
    -   New utils functions added (`tickRange`, `expDecs`, `biConv`).
    -   **Breaking** Moved utility functions (`encodeSqrtRatioX96()` and `sqrt()`) into the `utils` namespace.
    -   **Breaking** Moved constants (`Rounding`, `Q96` and `Q192`) into the `constants` namespace.
    -   **Breaking** Renamed output function `.toScalar()` to `.toFraction()`.
    -   Internal change of `toFixed()` and `toSignificant()` to accept a tuple Array instead of an Object.
-   **v1.1.0**, _31 Jul 2021_
    -   Added `tickPrice()` function to calculate price based on current tick value.
    -   Refactored the default price calculation function with better variable names.
    -   Fixed a decimal miscalculation issue on pairs with different decimal values.
-   **v1.0.0**, _19 Jul 2021_
    -   Big Bang

## License

Copyright © [Thanos Polychronakis][thanpolas] and Authors, [Licensed under ISC](/LICENSE).

[univ3]: https://docs.uniswap.org/sdk/introduction
[univ3graph]: https://thegraph.com/legacy-explorer/subgraph/uniswap/uniswap-v3
[slot0]: https://github.com/Uniswap/uniswap-v3-core/blob/b2c5555d696428c40c4b236069b3528b2317f3c1/contracts/interfaces/pool/IUniswapV3PoolState.sol#L21-L32
[toformat]: https://github.com/MikeMcl/toFormat#further-examples
[jsbi]: https://github.com/GoogleChromeLabs/jsbi#readme
[uni-pool]: https://github1s.com/Uniswap/uniswap-v3-sdk/blob/aeb1b09/src/entities/pool.ts#L96-L122
[uni-price]: https://github1s.com/Uniswap/uniswap-sdk-core/blob/HEAD/src/entities/fractions/price.ts
[uni-fraction]: https://github1s.com/Uniswap/uniswap-sdk-core/blob/HEAD/src/entities/fractions/fraction.ts
[npm-image]: https://img.shields.io/npm/v/@thanpolas/univ3prices.svg
[npm-url]: https://npmjs.org/package/@thanpolas/univ3prices
[circle-url]: https://circleci.com/gh/thanpolas/univ3prices/tree/main
[circle-image]: https://circleci.com/gh/thanpolas/univ3prices/tree/main.svg?style=svg
[jorropo]: https://github.com/Jorropo
[jpn]: https://github.com/jnp777/
[gakonst]: https://github.com/gakonst/
[dai-weth-pool]: https://etherscan.io/address/0x60594a405d53811d3bc4766596efd80fd545a270
[rounding]: #rounding-values
[tosignificant]: #tosignificantoptoptions
[tofixed]: #tofixedoptoptions
[tofraction]: #tofraction
[get-sqrt-tick-values]: #how-to-get-the-sqrtPrice-and-tick-values-from-uniswap
[sqrtprice]: #sqrtpricetokendecimals-sqrtratiox96
[tickprice]: #univ3pricestickpricetokendecimals-tick
[reserves]: #univ3pricesgetamountsforcurrentliquiditytokendecimals-liquidity-sqrtprice-tickspacing-optopts
[tick-math]: #tick-math-functions
[utilities]: #utility-functions
[constants]: #constants
[thanpolas]: https://github.com/thanpolas
[crypto-utils]: https://github.com/thanpolas/crypto-utils
[crypto-utils-options]: https://github.com/thanpolas/crypto-utils#calculation-and-formatting-options
[crypto-utils-toauto]: https://github.com/thanpolas/crypto-utils#toautofraction-optoptions
[crypto-utils-tofixed]: https://github.com/thanpolas/crypto-utils#tofixedfraction-optoptions
[crypto-utils-tosignificant]: https://github.com/thanpolas/crypto-utils#tosignificantfraction-optoptions
[crypto-utils-rounding]: https://github.com/thanpolas/crypto-utils#rounding
[getamountsforliquidityrange]: https://github.com/thanpolas/univ3prices#univ3pricesgetamountsforliquidityrangesqrtprice-sqrtpricea-sqrtpriceb-liquidity
[toauto]: #toautooptoptions
[univ3prices]: https://github.com/thanpolas/univ3prices
[crypto-utils]: https://github.com/thanpolas/crypto-utils
[uni-queries]: https://github.com/thanpolas/uniswap-chain-queries
